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

// Parallax interactivo 3D en el Hero (para el Spline-Container)
const heroSection = document.querySelector('.hero-section');
const splineContainer = document.querySelector('.spline-container');

if (heroSection && splineContainer) {
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = heroSection.getBoundingClientRect();
        const x = (clientX - left - width / 2) / (width / 2);
        const y = (clientY - top - height / 2) / (height / 2);

        gsap.to(splineContainer, {
            rotateY: x * 10,
            rotateX: -y * 10,
            x: x * 10,
            y: y * 10,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        gsap.to(splineContainer, {
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

// Función común para dibujar cuadrículas técnicas en los Canvas
function drawTechnicalGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(45, 74, 67, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 20; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

// ==========================================
// EJERCICIO EP-01: PINZA PARALELA DETALLADA
// ==========================================
let canvas1 = document.getElementById('canvas-ep01');
let ctx1 = canvas1.getContext('2d');
let animEP01 = { fingersX: 30, bottleY: 130, state: 'idle', statusText: 'LISTO' };

function drawEP01() {
    const w = canvas1.width;
    const h = canvas1.height;
    ctx1.clearRect(0, 0, w, h);
    
    // Cuadrícula
    drawTechnicalGrid(ctx1, w, h);

    // Soporte del actuador (metalizado)
    ctx1.fillStyle = '#b0b7bd';
    ctx1.fillRect(120, 15, 160, 25);
    ctx1.fillStyle = '#7a8288';
    ctx1.fillRect(130, 40, 140, 15);

    // Guias deslizantes y dedos de la garra
    const xLeft = 140 + animEP01.fingersX;
    const xRight = 245 - animEP01.fingersX;
    
    // Dedos
    ctx1.fillStyle = '#5a6b66';
    ctx1.fillRect(xLeft, 55, 15, 60); // Izquierdo
    ctx1.fillRect(xRight, 55, 15, 60); // Derecho
    
    // Almohadillas de goma antideslizante (goma oscura)
    ctx1.fillStyle = '#1e2a27';
    ctx1.fillRect(xLeft + 15, 70, 4, 35);
    ctx1.fillRect(xRight - 4, 70, 4, 35);

    // Botella de vidrio realista (verde salvia translúcida)
    ctx1.save();
    ctx1.fillStyle = 'rgba(141, 168, 155, 0.85)';
    ctx1.strokeStyle = '#2d4a43';
    ctx1.lineWidth = 2;
    // Cuerpo
    ctx1.fillRect(175, animEP01.bottleY, 50, 80);
    ctx1.strokeRect(175, animEP01.bottleY, 50, 80);
    // Cuello
    ctx1.fillRect(188, animEP01.bottleY - 25, 24, 25);
    ctx1.strokeRect(188, animEP01.bottleY - 25, 24, 25);
    // Tapón de corcho
    ctx1.fillStyle = '#d4a373';
    ctx1.fillRect(191, animEP01.bottleY - 33, 18, 10);
    ctx1.restore();

    // Dibujar vectores de fuerza cuando agarre
    if (animEP01.state === 'holding' || animEP01.state === 'lifting') {
        const fReq = parseFloat(document.getElementById('res-f1').textContent) || 12.81;
        ctx1.strokeStyle = '#c94a3a';
        ctx1.lineWidth = 3;
        // Flecha izquierda
        ctx1.beginPath();
        ctx1.moveTo(xLeft + 20, 87);
        ctx1.lineTo(xLeft + 35, 87);
        ctx1.lineTo(xLeft + 30, 82);
        ctx1.moveTo(xLeft + 35, 87);
        ctx1.lineTo(xLeft + 30, 92);
        ctx1.stroke();
        // Flecha derecha
        ctx1.beginPath();
        ctx1.moveTo(xRight - 5, 87);
        ctx1.lineTo(xRight - 20, 87);
        ctx1.lineTo(xRight - 15, 82);
        ctx1.moveTo(xRight - 20, 87);
        ctx1.lineTo(xRight - 15, 92);
        ctx1.stroke();

        ctx1.fillStyle = '#c94a3a';
        ctx1.font = 'bold 10px Inter';
        ctx1.fillText(`Fc = ${fReq.toFixed(1)} N`, 173, 80);
    }

    // Telemetría overlay
    ctx1.fillStyle = 'rgba(45, 74, 67, 0.85)';
    ctx1.fillRect(10, 195, 380, 45);
    ctx1.fillStyle = '#ffffff';
    ctx1.font = '11px Courier New';
    ctx1.fillText(`ESTADO: ${animEP01.statusText}`, 20, 212);
    ctx1.fillText(`POS_X_GARRA: ${animEP01.fingersX.toFixed(1)}mm | BOTELLA_Y: ${animEP01.bottleY.toFixed(1)}px`, 20, 228);
}

function simularEP01() {
    if (animEP01.state !== 'idle') return;
    animEP01.state = 'closing';
    animEP01.statusText = 'CERRANDO GARRAS...';
    
    gsap.to(animEP01, {
        fingersX: 20, 
        duration: 0.8,
        onUpdate: drawEP01,
        onComplete: () => {
            animEP01.state = 'holding';
            animEP01.statusText = 'SUJECIÓN ASEGURADA (HOLD)';
            drawEP01();
            
            setTimeout(() => {
                animEP01.state = 'lifting';
                animEP01.statusText = 'ELEVANDO BOTELLA (Z+)';
                gsap.to(animEP01, {
                    bottleY: 70,
                    duration: 1.2,
                    yoyo: true,
                    repeat: 1,
                    onUpdate: drawEP01,
                    onComplete: () => {
                        animEP01.state = 'opening';
                        animEP01.statusText = 'ABRIENDO GARRAS...';
                        gsap.to(animEP01, {
                            fingersX: 30,
                            bottleY: 130,
                            duration: 0.5,
                            onUpdate: drawEP01,
                            onComplete: () => {
                                animEP01.state = 'idle';
                                animEP01.statusText = 'LISTO';
                                drawEP01();
                            }
                        });
                    }
                });
            }, 600);
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

// Actualizar gráfico de EP01
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
// EJERCICIO EP-02: PINZA ANGULAR DINÁMICA
// ==========================================
let canvas2 = document.getElementById('canvas-ep02');
let ctx2 = canvas2.getContext('2d');
let animEP02 = { angle: 0.35, pieceY: 130, state: 'idle', statusText: 'LISTO' };

function drawEP02() {
    const w = canvas2.width;
    const h = canvas2.height;
    ctx2.clearRect(0, 0, w, h);
    
    drawTechnicalGrid(ctx2, w, h);

    // Cuerpo neumático de la garra angular (plateado)
    ctx2.fillStyle = '#7a8288';
    ctx2.fillRect(165, 20, 70, 50);
    ctx2.fillStyle = '#b0b7bd';
    ctx2.fillRect(175, 70, 50, 15);

    // Ejes pivots
    ctx2.fillStyle = '#1e2a27';
    ctx2.beginPath();
    ctx2.arc(185, 80, 4, 0, Math.PI * 2);
    ctx2.arc(215, 80, 4, 0, Math.PI * 2);
    ctx2.fill();

    // Brazo garras izquierdo y derecho
    ctx2.save();
    ctx2.translate(185, 80);
    ctx2.rotate(-animEP02.angle);
    ctx2.fillStyle = '#5a6b66';
    ctx2.fillRect(-10, 0, 15, 60);
    ctx2.fillStyle = '#2d4a43';
    ctx2.fillRect(5, 45, 12, 15); // Almohadilla angular
    ctx2.restore();

    ctx2.save();
    ctx2.translate(215, 80);
    ctx2.rotate(animEP02.angle);
    ctx2.fillStyle = '#5a6b66';
    ctx2.fillRect(-5, 0, 15, 60);
    ctx2.fillStyle = '#2d4a43';
    ctx2.fillRect(-17, 45, 12, 15); // Almohadilla angular
    ctx2.restore();

    // Pieza de masa (caja metálica)
    ctx2.fillStyle = '#d4a373';
    ctx2.fillRect(180, animEP02.pieceY, 40, 40);
    ctx2.strokeStyle = '#8c5827';
    ctx2.strokeRect(180, animEP02.pieceY, 40, 40);

    // Anuncios de Apto / Fallo
    if (animEP02.state === 'fail-dropping') {
        ctx2.fillStyle = 'rgba(201, 74, 58, 0.1)';
        ctx2.fillRect(0, 0, w, h);
        ctx2.fillStyle = '#c94a3a';
        ctx2.font = 'bold 12px Inter';
        ctx2.fillText('⚠️ DESLIZAMIENTO DETECTADO', 120, 120);
    } else if (animEP02.state === 'holding-ok') {
        ctx2.fillStyle = 'rgba(45, 74, 67, 0.1)';
        ctx2.fillRect(0, 0, w, h);
        ctx2.fillStyle = '#2d4a43';
        ctx2.font = 'bold 12px Inter';
        ctx2.fillText('✅ AGARRE SEGURO', 150, 120);
    }

    // Telemetría overlay
    ctx2.fillStyle = 'rgba(45, 74, 67, 0.85)';
    ctx2.fillRect(10, 195, 380, 45);
    ctx2.fillStyle = '#ffffff';
    ctx2.font = '11px Courier New';
    ctx2.fillText(`ESTADO: ${animEP02.statusText}`, 20, 212);
    ctx2.fillText(`ANGULO_GARRA: ${animEP02.angle.toFixed(2)}rad | PIEZA_Y: ${animEP02.pieceY.toFixed(1)}px`, 20, 228);
}

function simularEP02() {
    if (animEP02.state !== 'idle') return;
    animEP02.state = 'closing';
    animEP02.statusText = 'SUJETANDO Y CALCULANDO...';

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
        angle: 0.08,
        duration: 0.8,
        onUpdate: drawEP02,
        onComplete: () => {
            if (esApto) {
                animEP02.state = 'holding-ok';
                animEP02.statusText = 'SISTEMA SEGURO (F_disp > F_req)';
                drawEP02();
                
                // Animación de levantar
                gsap.to(animEP02, {
                    pieceY: 90,
                    duration: 1,
                    yoyo: true,
                    repeat: 1,
                    onUpdate: drawEP02,
                    onComplete: resetEP02
                });
            } else {
                animEP02.state = 'fail-dropping';
                animEP02.statusText = 'FALLO: FUERZA INSUFICIENTE!';
                drawEP02();
                
                // Simulación de deslizamiento y caída por gravedad
                setTimeout(() => {
                    gsap.to(animEP02, {
                        angle: 0.35,
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
                }, 500);
            }
        }
    });
}

function resetEP02() {
    gsap.to(animEP02, {
        angle: 0.35,
        pieceY: 130,
        duration: 0.5,
        onUpdate: drawEP02,
        onComplete: () => {
            animEP02.state = 'idle';
            animEP02.statusText = 'LISTO';
            drawEP02();
        }
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
// EJERCICIO EP-03: MESA XY DE SOLDADURA CON CHISPAS
// ==========================================
let canvas3 = document.getElementById('canvas-ep03');
let ctx3 = canvas3.getContext('2d');
let animEP03 = { gantryX: 80, carriageY: 80, state: 'idle', statusText: 'LISTO' };
let sparks = [];

function drawEP03() {
    const w = canvas3.width;
    const h = canvas3.height;
    ctx3.clearRect(0, 0, w, h);
    
    drawTechnicalGrid(ctx3, w, h);

    // Rieles de guía lineales X (arriba y abajo)
    ctx3.fillStyle = '#b0b7bd';
    ctx3.fillRect(30, 45, 340, 8);
    ctx3.fillRect(30, 185, 340, 8);

    // Gantry de aluminio que corre en X
    ctx3.fillStyle = '#5a6b66';
    ctx3.fillRect(animEP03.gantryX, 35, 24, 160);
    ctx3.fillStyle = '#2d4a43';
    ctx3.fillRect(animEP03.gantryX + 2, 40, 20, 15);
    ctx3.fillRect(animEP03.gantryX + 2, 175, 20, 15);

    // Carro de deslizamiento Y que corre en el gantry
    ctx3.fillStyle = '#d4a373';
    ctx3.fillRect(animEP03.gantryX - 6, animEP03.carriageY, 36, 36);
    ctx3.strokeStyle = '#8c5827';
    ctx3.strokeRect(animEP03.gantryX - 6, animEP03.carriageY, 36, 36);

    // Cabezal de soldadura (antorcha)
    ctx3.fillStyle = '#1e2a27';
    ctx3.fillRect(animEP03.gantryX + 8, animEP03.carriageY + 14, 18, 8);
    ctx3.fillStyle = '#c94a3a';
    ctx3.beginPath();
    ctx3.moveTo(animEP03.gantryX + 26, animEP03.carriageY + 18);
    ctx3.lineTo(animEP03.gantryX + 34, animEP03.carriageY + 18);
    ctx3.stroke();

    // Dibujar y actualizar chispas de soldadura si está soldando
    if (animEP03.state === 'soldering') {
        sparks.forEach((p, index) => {
            ctx3.fillStyle = `rgba(212, 163, 115, ${p.alpha})`;
            ctx3.beginPath();
            ctx3.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx3.fill();

            // Mover chispas
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.04;
            if (p.alpha <= 0) sparks.splice(index, 1);
        });

        // Emitir más chispas en el punto de la punta del soldador
        for (let i = 0; i < 3; i++) {
            sparks.push({
                x: animEP03.gantryX + 34,
                y: animEP03.carriageY + 18,
                vx: (Math.random() - 0.2) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                alpha: 1
            });
        }
    }

    // Telemetría overlay
    ctx3.fillStyle = 'rgba(45, 74, 67, 0.85)';
    ctx3.fillRect(10, 195, 380, 45);
    ctx3.fillStyle = '#ffffff';
    ctx3.font = '11px Courier New';
    ctx3.fillText(`ESTADO: ${animEP03.statusText}`, 20, 212);
    ctx3.fillText(`COORDENADA_X: ${(animEP03.gantryX * 1.25).toFixed(1)}mm | COORDENADA_Y: ${(animEP03.carriageY * 0.8).toFixed(1)}mm`, 20, 228);
}

function simularEP03() {
    if (animEP03.state !== 'idle') return;
    animEP03.state = 'moving';
    animEP03.statusText = 'DESPLAZANDO CABEZAL...';

    const targetX = 50 + Math.random() * 260;
    const targetY = 55 + Math.random() * 90;

    gsap.to(animEP03, {
        gantryX: targetX,
        carriageY: targetY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: drawEP03,
        onComplete: () => {
            animEP03.state = 'soldering';
            animEP03.statusText = 'SOLDANDO COMPONENTE (WELDER ACTIVE)';
            
            // Loop para mantener pintadas las chispas por 1 segundo
            let elapsed = 0;
            const weldInterval = setInterval(() => {
                drawEP03();
                elapsed += 50;
                if (elapsed >= 1000) {
                    clearInterval(weldInterval);
                    animEP03.state = 'idle';
                    animEP03.statusText = 'POSICIÓN ALCANZADA (LISTO)';
                    sparks = [];
                    drawEP03();
                }
            }, 50);
        }
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
// EJERCICIO EP-04: SECUENCIA DE CILINDROS FÍSICOS
// ==========================================
let canvas4 = document.getElementById('canvas-ep04');
let ctx4 = canvas4.getContext('2d');
let animEP04 = { rodX: 0, rodY: 0, stateText: 'LISTO', elapsedSecs: 0.0, step: 0 };

function drawEP04() {
    const w = canvas4.width;
    const h = canvas4.height;
    ctx4.clearRect(0, 0, w, h);
    
    drawTechnicalGrid(ctx4, w, h);

    // CILINDRO X (Horizontal en el plano superior)
    ctx4.fillStyle = '#7a8288';
    ctx4.fillRect(40, 50, 120, 30); // Cuerpo Cilindro X
    ctx4.fillStyle = '#b0b7bd';
    ctx4.fillRect(160, 60, animEP04.rodX, 10); // Vástago X

    // Cabezal guía de X
    ctx4.fillStyle = '#d4a373';
    ctx4.fillRect(160 + animEP04.rodX, 50, 15, 30);

    // CILINDRO Y (Vertical acoplado al final del recorrido de X)
    ctx4.fillStyle = '#7a8288';
    ctx4.fillRect(260, 50, 30, 80); // Cuerpo Cilindro Y
    ctx4.fillStyle = '#b0b7bd';
    ctx4.fillRect(270, 130, 10, animEP04.rodY); // Vástago Y

    // Herramienta Y
    ctx4.fillStyle = '#d4a373';
    ctx4.fillRect(260, 130 + animEP04.rodY, 30, 15);

    // Luces de los sensores S1, S2, S3, S4
    // S1 (Inicio X)
    ctx4.fillStyle = (animEP04.rodX < 5) ? '#55ff55' : '#882222';
    ctx4.beginPath(); ctx4.arc(45, 40, 4, 0, Math.PI*2); ctx4.fill();
    // S2 (Fin X)
    ctx4.fillStyle = (animEP04.rodX > 95) ? '#55ff55' : '#882222';
    ctx4.beginPath(); ctx4.arc(155, 40, 4, 0, Math.PI*2); ctx4.fill();
    // S3 (Inicio Y)
    ctx4.fillStyle = (animEP04.rodY < 5) ? '#55ff55' : '#882222';
    ctx4.beginPath(); ctx4.arc(250, 60, 4, 0, Math.PI*2); ctx4.fill();
    // S4 (Fin Y)
    ctx4.fillStyle = (animEP04.rodY > 45) ? '#55ff55' : '#882222';
    ctx4.beginPath(); ctx4.arc(250, 120, 4, 0, Math.PI*2); ctx4.fill();

    // Textos sensores
    ctx4.fillStyle = '#1e2a27';
    ctx4.font = '9px Inter';
    ctx4.fillText('S1', 41, 32);
    ctx4.fillText('S2', 151, 32);
    ctx4.fillText('S3', 234, 63);
    ctx4.fillText('S4', 234, 123);

    // Telemetría overlay
    ctx4.fillStyle = 'rgba(45, 74, 67, 0.85)';
    ctx4.fillRect(10, 195, 380, 45);
    ctx4.fillStyle = '#ffffff';
    ctx4.font = '11px Courier New';
    ctx4.fillText(`ETAPA: ${animEP04.stateText}`, 20, 212);
    ctx4.fillText(`TIEMPO TOTAL: ${animEP04.elapsedSecs.toFixed(2)}s | ROD_X: ${animEP04.rodX.toFixed(1)} | ROD_Y: ${animEP04.rodY.toFixed(1)}`, 20, 228);
}

function simularEP04() {
    if (animEP04.step !== 0) return;

    // Calcular tiempos físicos basados en caudales
    const qx = parseFloat(document.getElementById('slide-qx4').value) / 60000;
    const Dx = 50 / 1000;
    const Ax = Math.PI * Math.pow(Dx, 2) / 4;
    const vx = qx / Ax;
    const tx = 0.4 / vx; // Tiempo desplazamiento X

    const qy = parseFloat(document.getElementById('slide-qy4').value) / 60000;
    const Dy = 40 / 1000;
    const Ay = Math.PI * Math.pow(Dy, 2) / 4;
    const vy = qy / Ay;
    const ty = 0.2 / vy; // Tiempo desplazamiento Y

    const totalSeconds = (tx * 2) + (ty * 2);

    animEP04.step = 1;
    animEP04.elapsedSecs = 0.0;
    
    // Iniciar temporizador
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
        if (animEP04.step === 0) {
            clearInterval(timerInterval);
            return;
        }
        animEP04.elapsedSecs = (Date.now() - startTime) / 1000;
        drawEP04();
    }, 50);

    const tl = gsap.timeline({
        onUpdate: drawEP04,
        onComplete: () => {
            animEP04.step = 0;
            animEP04.stateText = 'CICLO TERMINADO (LISTO)';
            animEP04.elapsedSecs = totalSeconds;
            drawEP04();
        }
    });

    // 1. X+
    tl.to(animEP04, {
        rodX: 100,
        duration: tx,
        ease: "power1.inOut",
        onStart: () => { animEP04.stateText = '1. EJE X AVANCE (X+)'; }
    });
    // 2. Y+
    tl.to(animEP04, {
        rodY: 50,
        duration: ty,
        ease: "power1.inOut",
        onStart: () => { animEP04.stateText = '2. EJE Y AVANCE (Y+)'; }
    });
    // 3. Y-
    tl.to(animEP04, {
        rodY: 0,
        duration: ty,
        ease: "power1.inOut",
        onStart: () => { animEP04.stateText = '3. EJE Y RETROCESO (Y-)'; }
    });
    // 4. X-
    tl.to(animEP04, {
        rodX: 0,
        duration: tx,
        ease: "power1.inOut",
        onStart: () => { animEP04.stateText = '4. EJE X RETROCESO (X-)'; }
    });
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
// EJERCICIO EP-05: DETALLES DASHBOARD
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
