const carousel = document.getElementById('toolbox');
const originals = [...carousel.querySelectorAll('.tool-card')];

const SPEED = 60; // pixels per seconde (negatief = van rechts naar links)

// Zet alle kaarten in één track
const track = document.createElement('div');
track.className = 'tool-track';
originals.forEach(card => track.appendChild(card));
carousel.appendChild(track);

let setWidth = 0;
let offset = 0;
let paused = false;
let last = performance.now();

// Dupliceert de kaarten zodat de rij altijd het hele scherm vult
function build() {
    track.querySelectorAll('.is-clone').forEach(c => c.remove());

    // Eén kopie maken om de breedte van één set (inclusief tussenruimte) te meten
    const firstClone = originals[0].cloneNode(true);
    firstClone.classList.add('is-clone');
    firstClone.setAttribute('aria-hidden', 'true');
    track.appendChild(firstClone);
    setWidth = firstClone.offsetLeft - originals[0].offsetLeft;
    firstClone.remove();

    // Genoeg sets om de container te vullen, plus één extra voor de lus
    const copies = Math.ceil(carousel.clientWidth / setWidth) + 1;
    for (let c = 0; c < copies; c++) {
        originals.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('is-clone');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }
}

build();
window.addEventListener('resize', build);

carousel.addEventListener('mouseenter', () => paused = true);
carousel.addEventListener('mouseleave', () => paused = false);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function frame(now) {
    const dt = (now - last) / 1000;
    last = now;

    if (!paused && !reduceMotion) {
        offset = (offset + SPEED * dt) % setWidth;
        if (offset < 0) offset += setWidth;
    }

    // Van -setWidth naar 0: de rij schuift naar rechts en begint dan naadloos opnieuw
    track.style.transform = `translateX(${offset - setWidth}px)`;

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);