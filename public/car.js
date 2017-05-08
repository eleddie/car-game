function Car(id, x, y, enemy) {
    this.id = id;
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.enemy = enemy;
    this.angle = 0;
    this.life = 100;
}


Car.prototype.update = function () {
    var mousePos = createVector(mouseX, mouseY);
    var dir = mousePos.sub(this.pos);
    if (dir.mag() < 3) return;
    this.angle = dir.heading() + PI / 2;
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

Car.prototype.show = function () {
    push();
    var mousePos = createVector(mouseX, mouseY);
    var dir = mousePos.sub(this.pos);
    translate(this.pos.x, this.pos.y);
    //fill(random(255), random(255), random(255));
    if (!this.enemy) {
        stroke(200, 100);
        line(0, 0, dir.x, dir.y);
        fill(255);
    } else {
        fill(200, 30, 30);
    }
    rotate(this.enemy ? this.angle : dir.heading() + PI / 2);
    beginShape(CLOSE);
    vertex(0, -10);
    vertex(5, 5);
    vertex(-5, 5);
    endShape();
    pop();
}