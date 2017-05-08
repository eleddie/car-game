function Car(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.life = 100;
}


Car.prototype.update = function () {
    var mousePos = createVector(mouseX, mouseY);
    var dir = mousePos.sub(this.pos);
    this.acc.add(dir);
    this.vel.add(this.acc);
    this.vel.limit(3);
    this.pos.add(this.vel);
    this.acc.mult(0);
}

Car.prototype.shoot = function () {
    var mousePos = createVector(mouseX, mouseY);
    var heading = mousePos.sub(this.pos).heading();
    var newBullet = new Bullet(this.pos.x, this.pos.y, heading);
    return newBullet;
}