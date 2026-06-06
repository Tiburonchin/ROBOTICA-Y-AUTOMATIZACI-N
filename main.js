// Inicialización de GSAP
gsap.registerPlugin(ScrollTrigger);

// Animación de entrada de la presentación
const tl = gsap.timeline();
tl.fromTo(".gsap-title", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
  .fromTo(".gsap-info", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.5")
  .fromTo(".gsap-scroll", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");

// Animación de scroll para las secciones
document.querySelectorAll('.exercise-section').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%", // Animación inicia cuando la sección está al 80% del viewport
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Lógica EP-01
function calcEP01() {
    const m = 0.5; // kg
    const a = 3; // m/s2
    const g = 9.81;
    const FS = 2.0;
    const P = 5.5 * 100000; // bar a Pa
    const eta = 0.82;

    const F_req = m * (g + a) * FS;
    const A_min = F_req / (P * eta); // m2
    const A_mm2 = A_min * 1000000;
    const D_min = Math.sqrt((4 * A_mm2) / Math.PI); // mm

    document.getElementById('ep01-f').textContent = F_req.toFixed(2);
    document.getElementById('ep01-a').textContent = A_mm2.toFixed(2);
    document.getElementById('ep01-d').textContent = D_min.toFixed(2);
    
    showResults('#res-ep01');
}

// Lógica EP-02
function calcEP02() {
    const d = 25; // mm
    const A_m2 = (Math.PI * Math.pow(d, 2) / 4) / 1000000; // m2
    const P = 4 * 100000; // Pa
    const eta = 0.78;
    const k_brazo = 0.65;
    
    const m = 2; // kg
    const a = 5; // m/s2
    const g = 9.81;
    const FS = 2.0;

    const F_req = m * (g + a) * FS;
    const F_disp = P * A_m2 * eta * k_brazo;

    document.getElementById('ep02-freq').textContent = F_req.toFixed(2);
    document.getElementById('ep02-fdisp').textContent = F_disp.toFixed(2);

    const veredictoEl = document.getElementById('ep02-veredicto');
    let p_min_bar = 4;
    
    if (F_disp >= F_req) {
        veredictoEl.innerHTML = '<strong>Veredicto:</strong> <span style="color: #4ade80;">La garra es APTA</span>';
    } else {
        veredictoEl.innerHTML = '<strong>Veredicto:</strong> <span style="color: #f87171;">La garra NO es apta</span>';
        p_min_bar = (F_req / (A_m2 * eta * k_brazo)) / 100000;
    }

    document.getElementById('ep02-pmin').textContent = p_min_bar.toFixed(2);
    showResults('#res-ep02');
}

// Lógica EP-03
function calcEP03() {
    const m = 8; // kg
    const a = 1.5; // m/s2
    const P = 6 * 100000; // Pa
    const eta = 0.90;
    const FS = 2.0;

    // Asumimos movimiento horizontal, fuerza para acelerar masa
    const F_req = m * a * FS;
    const A_min_m2 = F_req / (P * eta);
    const D_min = Math.sqrt((4 * A_min_m2) / Math.PI) * 1000; // mm

    // Si elegimos un D estandar de 10mm (0.01m)
    const D_std = 10;
    const A_std_m2 = (Math.PI * Math.pow(D_std, 2) / 4) / 1000000;
    const F_real = P * A_std_m2 * eta;

    document.getElementById('ep03-f').textContent = F_req.toFixed(2);
    document.getElementById('ep03-d').textContent = D_min.toFixed(2);
    document.getElementById('ep03-freal').textContent = F_real.toFixed(2);
    
    showResults('#res-ep03');
}

// Lógica EP-04
function calcEP04() {
    // Eje X
    const Qx_m3s = 20 / 60000; // 20 L/min a m3/s
    const Dx = 50 / 1000; // m
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const vx = Qx_m3s / Ax;
    const tx = 0.4 / vx; // Carrera 400mm = 0.4m

    // Eje Y
    const Qy_m3s = 12 / 60000; // 12 L/min a m3/s
    const Dy = 40 / 1000; // m
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const vy = Qy_m3s / Ay;
    const ty = 0.2 / vy; // Carrera 200mm = 0.2m

    const t_total = (tx * 2) + (ty * 2);

    document.getElementById('ep04-vx').textContent = vx.toFixed(3);
    document.getElementById('ep04-tx').textContent = tx.toFixed(2);
    document.getElementById('ep04-vy').textContent = vy.toFixed(3);
    document.getElementById('ep04-ty').textContent = ty.toFixed(2);
    document.getElementById('ep04-ttotal').textContent = t_total.toFixed(2);
    
    showResults('#res-ep04');
}

// Utilidad para mostrar resultados con animación GSAP
function showResults(selector) {
    const el = document.querySelector(selector);
    el.classList.remove('hidden');
    gsap.fromTo(el, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.5, ease: "power2.out" });
}
