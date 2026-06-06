// Inicializar GSAP y ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animaciones del Hero
gsap.from(".gsap-hero-left > *", {
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".gsap-hero-right", {
    opacity: 0,
    scale: 0.9,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.3
});

// Scroll Trigger para las secciones de ejercicios
document.querySelectorAll('.exercise-section').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Control del menú de navegación activo según el scroll
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// LOGICA DE CALCULO - EP-01
function calcularEP01() {
    const m = parseFloat(document.getElementById('m1').value) || 0.5;
    const a = parseFloat(document.getElementById('a1').value) || 3;
    const P_bar = parseFloat(document.getElementById('p1').value) || 5.5;
    
    const g = 9.81;
    const FS = 2.0;
    const P_pa = P_bar * 100000; // bar to Pa
    const eta = 0.82;

    // F_min = m * (g + a) * FS
    const F_req = m * (g + a) * FS;
    // A_min = F_req / (P * eta)
    const A_min_m2 = F_req / (P_pa * eta);
    const A_min_mm2 = A_min_m2 * 1000000;
    // D_min = sqrt(4 * A / pi)
    const D_min = Math.sqrt((4 * A_min_mm2) / Math.PI);

    // Actualizar interfaz con animaciones sutiles
    animateValue('res-f1', F_req.toFixed(2));
    animateValue('res-a1', A_min_mm2.toFixed(2));
    animateValue('res-d1', D_min.toFixed(2));
}

// LOGICA DE CALCULO - EP-02
function calcularEP02() {
    const d = 25; // mm
    const A_m2 = (Math.PI * Math.pow(d, 2) / 4) / 1000000;
    const P = 4 * 100000; // 4 bar
    const eta = 0.78;
    const k_brazo = 0.65;
    
    const m = 2; // kg
    const a = 5; // m/s2
    const g = 9.81;
    const FS = 2.0;

    const F_req = m * (g + a) * FS;
    const F_disp = P * A_m2 * eta * k_brazo;

    animateValue('res-freq2', F_req.toFixed(2));
    animateValue('res-fdisp2', F_disp.toFixed(2));

    const veredictoCard = document.getElementById('veredicto-card');
    const resApto = document.getElementById('res-apto2');
    const resPres = document.getElementById('res-pres2');

    if (F_disp >= F_req) {
        resApto.textContent = "APTA";
        resPres.textContent = "Presión OK (4.0 bar)";
        veredictoCard.style.backgroundColor = "#2d4a43";
        veredictoCard.style.color = "#ffffff";
    } else {
        const p_min_bar = (F_req / (A_m2 * eta * k_brazo)) / 100000;
        resApto.textContent = "NO APTA";
        resPres.textContent = `Requerido: ${p_min_bar.toFixed(2)} bar`;
        veredictoCard.style.backgroundColor = "#c94a3a"; // Terracotta oscuro/rojo
        veredictoCard.style.color = "#ffffff";
    }
}

// LOGICA DE CALCULO - EP-03
function calcularEP03() {
    const m = 8; // kg
    const a = 1.5; // m/s2
    const P = 6 * 100000; // Pa
    const eta = 0.90;
    const FS = 2.0;

    const F_req = m * a * FS;
    const A_min_m2 = F_req / (P * eta);
    const D_min = Math.sqrt((4 * A_min_m2) / Math.PI) * 1000; // mm

    const D_std = 10;
    const A_std_m2 = (Math.PI * Math.pow(D_std, 2) / 4) / 1000000;
    const F_real = P * A_std_m2 * eta;

    animateValue('res-freq3', F_req.toFixed(2));
    animateValue('res-dmin3', D_min.toFixed(2));
    animateValue('res-freal3', F_real.toFixed(2));
}

// LOGICA DE CALCULO - EP-04
function calcularEP04() {
    const Qx = 20 / 60000; // X L/min a m3/s
    const Dx = 50 / 1000; // m
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const vx = Qx / Ax;
    const tx = 0.4 / vx; // 400mm carrera

    const Qy = 12 / 60000; // Y L/min a m3/s
    const Dy = 40 / 1000; // m
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const vy = Qy / Ay;
    const ty = 0.2 / vy; // 200mm carrera

    const t_total = (tx * 2) + (ty * 2);

    document.getElementById('res-v4').innerHTML = `X: ${vx.toFixed(2)} | Y: ${vy.toFixed(2)}`;
    document.getElementById('res-t4').innerHTML = `X: ${tx.toFixed(1)} | Y: ${ty.toFixed(1)}`;
    animateValue('res-ttotal4', t_total.toFixed(2));
}

// Función auxiliar para animar el cambio de valores numéricos
function animateValue(id, targetValue) {
    const el = document.getElementById(id);
    gsap.fromTo(el, { scale: 0.8, opacity: 0.5 }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(2)",
        onStart: () => {
            el.textContent = targetValue;
        }
    });
}

// Ejecutar el primer cálculo por defecto
window.onload = () => {
    calcularEP01();
};
