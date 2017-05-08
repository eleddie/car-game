function Car(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.movement = [false, false, false, false];
}

Car.prototype.move = function () {
    if (this.movement[0]) {
        this.applyForce(createVector(0, -10));
        this.update();
    }
    if (this.movement[1]) {
        this.applyForce(createVector(10, 0));
        this.update();
    }
    if (this.movement[2]) {
        this.applyForce(createVector(0, 10));
        this.update();
    }
    if (this.movement[3]) {
        this.applyForce(createVector(-10, 0));
        this.update();
    }
}
Car.prototype.applyForce = function (force) {
    this.acc.add(force);
}

Car.prototype.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
}