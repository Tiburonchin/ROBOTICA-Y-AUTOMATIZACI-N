// Inicializar Lucide Icons
lucide.createIcons();

// Inicializar GSAP y ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animaciones de entrada del Hero
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

// Slideshow del Hero
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide-img');
if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // Cambia cada 4 segundos
}

// Parallax interactivo y 3D en el Hero al mover el mouse (aplicado al contenedor del slideshow)
const heroSection = document.querySelector('.hero-section');
const slideshowContainer = document.querySelector('.hero-slideshow-container');

if (heroSection && slideshowContainer) {
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = heroSection.getBoundingClientRect();
        
        // Coordenadas relativas de -1 a 1
        const x = (clientX - left - width / 2) / (width / 2);
        const y = (clientY - top - height / 2) / (height / 2);

        // Rotar contenedor en 3D
        gsap.to(slideshowContainer, {
            rotateY: x * 15, // max 15deg
            rotateX: -y * 15,
            x: x * 15,
            y: y * 15,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    // Resetear al salir
    heroSection.addEventListener('mouseleave', () => {
        gsap.to(slideshowContainer, {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}

// Animación al hacer Scroll en las secciones
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

// Control del Menú Activo en Scroll
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

// ==========================================
// VARIABLES GLOBALES DE GRÁFICOS (CHART.JS)
// ==========================================
let chart1, chart2, chart3, chart4;

// ==========================================
// EJERCICIO EP-01
// ==========================================
let canvas1 = document.getElementById('canvas-ep01');
let ctx1 = canvas1.getContext('2d');
let animEP01 = { fingersX: 40, bottleY: 120, state: 'idle' };

function drawEP01() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.fillStyle = '#2d4a43';
    ctx1.fillRect(100, 20, 200, 20);
    ctx1.fillStyle = '#8da89b';
    ctx1.fillRect(100 + animEP01.fingersX, 40, 15, 60);
    ctx1.fillRect(285 - animEP01.fingersX, 40, 15, 60);
    ctx1.fillStyle = '#d4a373';
    ctx1.fillRect(175, animEP01.bottleY, 50, 90);
    ctx1.fillRect(190, animEP01.bottleY - 30, 20, 30);
}

function simularEP01() {
    if (animEP01.state !== 'idle') return;
    animEP01.state = 'closing';
    
    gsap.to(animEP01, {
        fingersX: 65, 
        duration: 0.8,
        onUpdate: drawEP01,
        onComplete: () => {
            animEP01.state = 'lifting';
            gsap.to(animEP01, {
                bottleY: 70,
                duration: 1.2,
                yoyo: true,
                repeat: 1,
                onUpdate: drawEP01,
                onComplete: () => {
                    gsap.to(animEP01, {
                        fingersX: 40,
                        bottleY: 120,
                        duration: 0.5,
                        onUpdate: drawEP01,
                        onComplete: () => {
                            animEP01.state = 'idle';
                        }
                    });
                }
            });
        }
    });
}

function actualizarEP01() {
    const m = parseFloat(document.getElementById('slide-m1').value);
    const a = parseFloat(document.getElementById('slide-a1').value);
    const P = parseFloat(document.getElementById('slide-p1').value);

    document.getElementById('val-m1').textContent = m.toFixed(1);
    document.getElementById('val-a1').textContent = a.toFixed(1);
    document.getElementById('val-p1').textContent = P.toFixed(1);

    const g = 9.81;
    const FS = 2.0;
    const P_pa = P * 100000;
    const eta = 0.82;

    const F_req = m * (g + a) * FS;
    const A_min_m2 = F_req / (P_pa * eta);
    const A_min_mm2 = A_min_m2 * 1000000;
    const D_min = Math.sqrt((4 * A_min_mm2) / Math.PI);

    document.getElementById('res-f1').textContent = F_req.toFixed(2);
    document.getElementById('res-a1').textContent = A_min_mm2.toFixed(2);
    document.getElementById('res-d1').textContent = D_min.toFixed(2);

    updateChart01(D_min, P);
}

function initChart01() {
    const ctx = document.getElementById('chart-ep01').getContext('2d');
    chart1 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
                label: 'Diámetro Mínimo (mm) vs Presión (bar)',
                borderColor: '#2d4a43',
                backgroundColor: 'rgba(45, 74, 67, 0.1)',
                data: [],
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { title: { display: true, text: 'Diámetro (mm)' } },
                x: { title: { display: true, text: 'Presión (bar)' } }
            }
        }
    });
}

function updateChart01(currentD, currentP) {
    const m = parseFloat(document.getElementById('slide-m1').value);
    const a = parseFloat(document.getElementById('slide-a1').value);
    const g = 9.81;
    const FS = 2.0;
    const eta = 0.82;
    const F_req = m * (g + a) * FS;

    const data = [];
    for (let p = 1; p <= 10; p++) {
        const p_pa = p * 100000;
        const A = F_req / (p_pa * eta);
        const D = Math.sqrt((4 * A * 1000000) / Math.PI);
        data.push(D);
    }
    chart1.data.datasets[0].data = data;
    chart1.update();
}

// ==========================================
// EJERCICIO EP-02
// ==========================================
let canvas2 = document.getElementById('canvas-ep02');
let ctx2 = canvas2.getContext('2d');
let animEP02 = { angle: 0.3, pieceY: 130, state: 'idle' };

function drawEP02() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.fillStyle = '#2d4a43';
    ctx2.fillRect(175, 20, 50, 60);

    ctx2.save();
    ctx2.translate(185, 80);
    ctx2.rotate(-animEP02.angle);
    ctx2.fillStyle = '#8da89b';
    ctx2.fillRect(-10, 0, 15, 60);
    ctx2.restore();

    ctx2.save();
    ctx2.translate(215, 80);
    ctx2.rotate(animEP02.angle);
    ctx2.fillStyle = '#8da89b';
    ctx2.fillRect(-5, 0, 15, 60);
    ctx2.restore();

    ctx2.fillStyle = '#d4a373';
    ctx2.fillRect(180, animEP02.pieceY, 40, 40);
}

function simularEP02() {
    if (animEP02.state !== 'idle') return;
    animEP02.state = 'closing';

    const m = parseFloat(document.getElementById('slide-m2').value);
    const a = parseFloat(document.getElementById('slide-a2').value);
    const P = parseFloat(document.getElementById('slide-p2').value);
    const g = 9.81;
    const FS = 2.0;
    
    const d = 25; 
    const A = (Math.PI * Math.pow(d, 2) / 4) / 1000000;
    const eta = 0.78;
    const k_brazo = 0.65;

    const F_req = m * (g + a) * FS;
    const F_disp = (P * 100000) * A * eta * k_brazo;
    const esApto = F_disp >= F_req;

    gsap.to(animEP02, {
        angle: 0.05,
        duration: 0.6,
        onUpdate: drawEP02,
        onComplete: () => {
            if (esApto) {
                animEP02.state = 'lifting';
                gsap.to(animEP02, {
                    pieceY: 80,
                    duration: 1,
                    yoyo: true,
                    repeat: 1,
                    onUpdate: drawEP02,
                    onComplete: resetEP02
                });
            } else {
                animEP02.state = 'dropping';
                gsap.to(animEP02, {
                    angle: 0.3,
                    duration: 0.3,
                    onUpdate: drawEP02
                });
                gsap.to(animEP02, {
                    pieceY: 210,
                    duration: 0.8,
                    ease: "bounce.out",
                    onUpdate: drawEP02,
                    onComplete: resetEP02
                });
            }
        }
    });
}

function resetEP02() {
    gsap.to(animEP02, {
        angle: 0.3,
        pieceY: 130,
        duration: 0.5,
        onUpdate: drawEP02,
        onComplete: () => { animEP02.state = 'idle'; }
    });
}

function actualizarEP02() {
    const m = parseFloat(document.getElementById('slide-m2').value);
    const a = parseFloat(document.getElementById('slide-a2').value);
    const P = parseFloat(document.getElementById('slide-p2').value);

    document.getElementById('val-m2').textContent = m.toFixed(1);
    document.getElementById('val-a2').textContent = a.toFixed(1);
    document.getElementById('val-p2').textContent = P.toFixed(1);

    const g = 9.81;
    const FS = 2.0;
    const d = 25; 
    const A = (Math.PI * Math.pow(d, 2) / 4) / 1000000;
    const eta = 0.78;
    const k_brazo = 0.65;

    const F_req = m * (g + a) * FS;
    const F_disp = (P * 100000) * A * eta * k_brazo;

    document.getElementById('res-freq2').textContent = F_req.toFixed(2);
    document.getElementById('res-fdisp2').textContent = F_disp.toFixed(2);

    const card = document.getElementById('veredicto-card');
    const label = document.getElementById('res-apto2');
    const sub = document.getElementById('res-pres2');

    if (F_disp >= F_req) {
        label.textContent = "APTA";
        sub.textContent = "Suficiente";
        card.style.backgroundColor = "var(--primary-green)";
    } else {
        const p_req = (F_req / (A * eta * k_brazo)) / 100000;
        label.textContent = "NO APTA";
        sub.textContent = `Req: ${p_req.toFixed(1)} bar`;
        card.style.backgroundColor = "#c94a3a";
    }

    updateChart02(F_req);
}

function initChart02() {
    const ctx = document.getElementById('chart-ep02').getContext('2d');
    chart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [
                {
                    label: 'Fuerza Disponible (N)',
                    borderColor: '#8da89b',
                    data: []
                },
                {
                    label: 'Fuerza Requerida (N)',
                    borderColor: '#c94a3a',
                    borderDash: [5, 5],
                    data: [],
                    fill: false
                }
            ]
        },
        options: { responsive: true }
    });
}

function updateChart02(F_req) {
    const d = 25;
    const A = (Math.PI * Math.pow(d, 2) / 4) / 1000000;
    const eta = 0.78;
    const k_brazo = 0.65;

    const dispData = [];
    const reqData = [];
    for (let p = 1; p <= 10; p++) {
        dispData.push((p * 100000) * A * eta * k_brazo);
        reqData.push(F_req);
    }
    chart2.data.datasets[0].data = dispData;
    chart2.data.datasets[1].data = reqData;
    chart2.update();
}

// ==========================================
// EJERCICIO EP-03
// ==========================================
let canvas3 = document.getElementById('canvas-ep03');
let ctx3 = canvas3.getContext('2d');
let animEP03 = { gantryX: 80, carriageY: 80, state: 'idle' };

function drawEP03() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    
    ctx3.strokeStyle = '#f0ebe1';
    ctx3.lineWidth = 6;
    ctx3.beginPath();
    ctx3.moveTo(40, 50);
    ctx3.lineTo(360, 50);
    ctx3.stroke();

    ctx3.fillStyle = '#2d4a43';
    ctx3.fillRect(animEP03.gantryX, 35, 20, 160);

    ctx3.fillStyle = '#d4a373';
    ctx3.fillRect(animEP03.gantryX - 5, animEP03.carriageY, 30, 30);
}

function simularEP03() {
    if (animEP03.state !== 'idle') return;
    animEP03.state = 'moving';

    const targetX = 40 + Math.random() * 280;
    const targetY = 50 + Math.random() * 100;

    gsap.to(animEP03, {
        gantryX: targetX,
        carriageY: targetY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: drawEP03,
        onComplete: () => { animEP03.state = 'idle'; }
    });
}

function actualizarEP03() {
    const m = parseFloat(document.getElementById('slide-m3').value);
    const a = parseFloat(document.getElementById('slide-a3').value);

    document.getElementById('val-m3').textContent = m.toFixed(1);
    document.getElementById('val-a3').textContent = a.toFixed(1);

    const P = 6 * 100000;
    const eta = 0.90;
    const FS = 2.0;

    const F_req = m * a * FS;
    const A_min = F_req / (P * eta);
    const D_min = Math.sqrt((4 * A_min) / Math.PI) * 1000;

    const D_std = 10;
    const A_std = (Math.PI * Math.pow(D_std / 1000, 2)) / 4;
    const F_real = P * A_std * eta;

    document.getElementById('res-freq3').textContent = F_req.toFixed(2);
    document.getElementById('res-dmin3').textContent = D_min.toFixed(2);
    document.getElementById('res-freal3').textContent = F_real.toFixed(2);

    updateChart03(m);
}

function initChart03() {
    const ctx = document.getElementById('chart-ep03').getContext('2d');
    chart3 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1.0', '1.5', '2.0', '2.5', '3.0'],
            datasets: [{
                label: 'Fuerza Requerida (N) vs Aceleración',
                backgroundColor: '#2d4a43',
                data: []
            }]
        },
        options: { responsive: true }
    });
}

function updateChart03(m) {
    const FS = 2.0;
    const data = [];
    const accs = [1.0, 1.5, 2.0, 2.5, 3.0];
    accs.forEach(a => {
        data.push(m * a * FS);
    });
    chart3.data.datasets[0].data = data;
    chart3.update();
}

// ==========================================
// EJERCICIO EP-04
// ==========================================
let canvas4 = document.getElementById('canvas-ep04');
let ctx4 = canvas4.getContext('2d');
let animEP04 = { x: 50, y: 180, step: 0 };

function drawEP04() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

    ctx4.strokeStyle = '#f0ebe1';
    ctx4.lineWidth = 2;
    ctx4.setLineDash([5, 5]);
    ctx4.strokeRect(50, 50, 300, 130);
    ctx4.setLineDash([]);

    ctx4.fillStyle = '#2d4a43';
    ctx4.beginPath();
    ctx4.arc(animEP04.x, animEP04.y, 10, 0, Math.PI * 2);
    ctx4.fill();
}

function simularEP04() {
    const Qx = parseFloat(document.getElementById('slide-qx4').value) / 60000;
    const Dx = 50 / 1000;
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const vx = Qx / Ax;
    const tx = 0.4 / vx;

    const Qy = parseFloat(document.getElementById('slide-qy4').value) / 60000;
    const Dy = 40 / 1000;
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const vy = Qy / Ay;
    const ty = 0.2 / vy;

    const tScale = 0.5;

    const tl = gsap.timeline({ onUpdate: drawEP04 });
    tl.to(animEP04, { x: 50, y: 180, duration: 0 });
    tl.to(animEP04, { x: 350, duration: tx * tScale, ease: "none" });
    tl.to(animEP04, { y: 50, duration: ty * tScale, ease: "none" });
    tl.to(animEP04, { y: 180, duration: ty * tScale, ease: "none" });
    tl.to(animEP04, { x: 50, duration: tx * tScale, ease: "none" });
}

function actualizarEP04() {
    const qx = parseFloat(document.getElementById('slide-qx4').value);
    const qy = parseFloat(document.getElementById('slide-qy4').value);

    document.getElementById('val-qx4').textContent = qx;
    document.getElementById('val-qy4').textContent = qy;

    const Qx_m3s = qx / 60000;
    const Dx = 50 / 1000;
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const vx = Qx_m3s / Ax;
    const tx = 0.4 / vx;

    const Qy_m3s = qy / 60000;
    const Dy = 40 / 1000;
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const vy = Qy_m3s / Ay;
    const ty = 0.2 / vy;

    const t_total = (tx * 2) + (ty * 2);

    document.getElementById('res-v4').innerHTML = `X: ${vx.toFixed(2)} | Y: ${vy.toFixed(2)}`;
    document.getElementById('res-t4').innerHTML = `X: ${tx.toFixed(1)} | Y: ${ty.toFixed(1)}`;
    document.getElementById('res-ttotal4').textContent = t_total.toFixed(2);

    updateChart04(qy);
}

function initChart04() {
    const ctx = document.getElementById('chart-ep04').getContext('2d');
    chart4 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [5, 10, 15, 20, 25, 30, 35, 40],
            datasets: [{
                label: 'Tiempo total de ciclo (s) vs Caudal X',
                borderColor: '#d4a373',
                data: []
            }]
        },
        options: { responsive: true }
    });
}

function updateChart04(qy) {
    const Dx = 50 / 1000;
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const Dy = 40 / 1000;
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const Qy_m3s = qy / 60000;
    const vy = Qy_m3s / Ay;
    const ty = 0.2 / vy;

    const data = [];
    const qxs = [5, 10, 15, 20, 25, 30, 35, 40];
    qxs.forEach(qx => {
        const Qx = qx / 60000;
        const vx = Qx / Ax;
        const tx = 0.4 / vx;
        data.push((tx * 2) + (ty * 2));
    });
    chart4.data.datasets[0].data = data;
    chart4.update();
}

// ==========================================
// EJERCICIO EP-05
// ==========================================
const componentsData = {
    frl: {
        title: "Unidad FRL (Filtro, Regulador y Lubricador)",
        desc: "Equipada con conexión G1/4\" y capacidad para un caudal de hasta 1200 L/min, garantizando suministro limpio para los 20 L/min máximos requeridos en el Eje X. Purga automática de condensado y filtrado fino de 40 micras para protección del pistón."
    },
    garra: {
        title: "Actuadores y Garra Paralela",
        desc: "Eje X: Cilindro guiado de doble efecto Ø 25 mm y carrera 250 mm. Eje Y: Cilindro Ø 25 mm y carrera 150 mm. Garra Paralela: Fuerza de sujeción superior a 60 N para piezas de 1.5 kg (aplicando un FS de 2.0 y coeficiente de fricción estándar)."
    },
    valvulas: {
        title: "Bloque de Electroválvulas",
        desc: "3 x Válvulas direccionales 5/2 de accionamiento solenoide neumático biestable y monoestable, operadas a 24V DC. Control de avance y retroceso estable para los ejes X, Y y la Garra de sujeción."
    },
    plc: {
        title: "Controlador PLC S7-1200",
        desc: "Sincroniza y monitorea la secuencia mediante entradas digitales conectadas a sensores de final de carrera magnéticos (6 en total), y salidas digitales a transistor para la rápida conmutación de las válvulas de solenoide."
    }
};

function selectComponent(key) {
    const data = componentsData[key];
    const panel = document.getElementById('db-details');
    
    gsap.to(panel, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
            document.getElementById('db-detail-title').textContent = data.title;
            document.getElementById('db-detail-desc').textContent = data.desc;
            gsap.to(panel, {
                opacity: 1,
                y: 0,
                duration: 0.3
            });
        }
    });
}

// ==========================================
// CARGA INICIAL
// ==========================================
window.onload = () => {
    drawEP01();
    drawEP02();
    drawEP03();
    drawEP04();

    initChart01();
    initChart02();
    initChart03();
    initChart04();

    actualizarEP01();
    actualizarEP02();
    actualizarEP03();
    actualizarEP04();
};
