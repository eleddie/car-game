function Bullet(x, y, angle, speed) {
    this.pos = createVector(x, y);
    this.angle = angle;
    this.speed = speed || 5;
}

Bullet.prototype.update = function () {
    this.pos.x += this.speed * cos(this.angle);
    this.pos.y += this.speed * sin(this.angle);
}

Bullet.prototype.show = function () {
    fill(0, 255, 30, 150);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 5, 5);
}