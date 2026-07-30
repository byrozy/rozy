const canvas = document.getElementById("cloudCanvas");
const ctx = canvas.getContext("2d");

const img = document.getElementById("cloudSource");

let particles = [];

const mouse = {
    x: -10000,
    y: -10000,
    radius: 130
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
    mouse.x = -10000;
    mouse.y = -10000;
});

class Particle {

    constructor(x, y) {

        this.homeX = x;
        this.homeY = y;

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.size = 2 + Math.random() * 2;
    }

    update() {

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {

            const force = (mouse.radius - dist) / mouse.radius;

            this.vx -= (dx / dist) * force * 2.2;
            this.vy -= (dy / dist) * force * 2.2;
        }

        this.vx += (this.homeX - this.x) * 0.02;
        this.vy += (this.homeY - this.y) * 0.02;

        this.vx *= 0.90;
        this.vy *= 0.90;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {

        ctx.beginPath();

        ctx.fillStyle = "#ffffff";

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

}

function createParticles() {

    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    const scale = 0.8;

    temp.width = img.naturalWidth * scale;
    temp.height = img.naturalHeight * scale;

    tctx.drawImage(img, 0, 0, temp.width, temp.height);

    const data = tctx.getImageData(
        0,
        0,
        temp.width,
        temp.height
    ).data;

    particles = [];

    const offsetX = (canvas.width - temp.width) / 2;
    const offsetY = (canvas.height - temp.height) / 2;

    const gap = 5;

    for (let y = 0; y < temp.height; y += gap) {

        for (let x = 0; x < temp.width; x += gap) {

            const alpha = data[(y * temp.width + x) * 4 + 3];

            if (alpha > 60) {

                particles.push(
                    new Particle(
                        offsetX + x,
                        offsetY + y
                    )
                );

            }

        }

    }

}

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const p of particles) {

        p.update();
        p.draw();

    }

    requestAnimationFrame(animate);

}

img.onload = () => {

    createParticles();
    animate();

};

if (img.complete) {

    img.onload();

}