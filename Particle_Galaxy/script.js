const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.clearRect(0, 0, canvas.width, canvas.height);
const colors = [
    "#ffffff",
    "#dbeafe",
    "#cfe8ff",
    "#fff8dc"
];
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    active: false
};
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
});
window.addEventListener("mouseleave", () => {
    mouse.active = false;
});
window.addEventListener("touchstart", (e) => {
    mouse.active = true;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});
window.addEventListener("touchend", () => {
    mouse.active = false;
});
class Star {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = Math.random();
        this.dAlpha = (Math.random() * 0.02) + 0.005;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 20 + this.alpha * 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    drift() {
        if (mouse.active != true) {
            return;
        }
        let x = mouse.x - this.x;
        let y = mouse.y - this.y;
        let dist = Math.sqrt(x * x + y * y);
        if (dist>0 && dist <= 300) {
            this.dx += (x / dist) * 0.01;
            this.dy += (y / dist) * 0.01;
        }
    }
    update() {
        this.alpha += this.dAlpha;

        if (this.alpha >= 1 || this.alpha <= 0.2)
            this.dAlpha = -this.dAlpha;
        this.x += this.dx;
        this.y += this.dy;
        if (this.x - this.radius > canvas.width) {
            this.x = -this.radius
        }
        if (this.x + this.radius < 0) {
            this.x = canvas.width + this.radius
        }
        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius
        }
        if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
        }
        this.dx *= 0.97;
        this.dy *= 0.97;
        this.drift();
        this.draw();
    }
}
const stars = [];
for (let i = 0; i < 300; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let radius = Math.random() * 2 + 1;
    let dx = Math.random() * 0.6 - 0.3;
    let dy = Math.random() * 0.6 - 0.3;
    stars.push(new Star(x, y, radius, dx, dy));

};

function animate() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    for (const star of stars) {
        star.update();
    }
    requestAnimationFrame(animate);
}
animate();