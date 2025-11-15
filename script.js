const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];

for (let i = 0; i < 140; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        sx: (Math.random() - 0.5) * 0.4,
        sy: (Math.random() - 0.5) * 0.4
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        p.x += p.sx;
        p.y += p.sy;

        if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.sy *= -1;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

animate();
