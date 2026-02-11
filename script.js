// ================= GRAVITY GRID WITH MASS CIRCLE =================

const canvas = document.getElementById("grid-canvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let width, height;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    const spacing = 50;
    const radius = 180;
    const strength = 40;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "#e6e6e6";
        ctx.lineWidth = 1;

        // === GRID ===
        for (let y = 0; y <= height; y += spacing) {

            ctx.beginPath();

            for (let x = 0; x <= width; x += 10) {

                const dx = x - mouse.x;
                const dy = y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let offsetX = 0;
                let offsetY = 0;

                if (dist < radius && dist > 0) {
                    const force = (1 - dist / radius);
                    const nx = dx / dist;
                    const ny = dy / dist;

                    offsetX = nx * force * strength;
                    offsetY = ny * force * strength;
                }

                if (x === 0) {
                    ctx.moveTo(x + offsetX, y + offsetY);
                } else {
                    ctx.lineTo(x + offsetX, y + offsetY);
                }
            }

            ctx.stroke();
        }

        for (let x = 0; x <= width; x += spacing) {

            ctx.beginPath();

            for (let y = 0; y <= height; y += 10) {

                const dx = x - mouse.x;
                const dy = y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let offsetX = 0;
                let offsetY = 0;

                if (dist < radius && dist > 0) {
                    const force = (1 - dist / radius);
                    const nx = dx / dist;
                    const ny = dy / dist;

                    offsetX = nx * force * strength;
                    offsetY = ny * force * strength;
                }

                if (y === 0) {
                    ctx.moveTo(x + offsetX, y + offsetY);
                } else {
                    ctx.lineTo(x + offsetX, y + offsetY);
                }
            }

            ctx.stroke();
        }

        // === MASS CIRCLE ===
        if (mouse.x > 0 && mouse.y > 0) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, radius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
            ctx.stroke();
        }

        requestAnimationFrame(draw);
    }

    draw();
}



// ================= STL VIEWER =================

let scene, camera, renderer, controls, mesh;

const viewerContainer = document.getElementById("stlViewer");

if (viewerContainer) {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        viewerContainer.clientWidth / viewerContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 120);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    viewerContainer.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambient);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    loadModel("models/rocket.stl");

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function loadModel(path) {
    const loader = new THREE.STLLoader();

    loader.load(path, function (geometry) {

        if (mesh) scene.remove(mesh);

        geometry.center();

        const material = new THREE.MeshStandardMaterial({
            color: 0x888888
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    });
}
