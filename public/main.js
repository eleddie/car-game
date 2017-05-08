var car;
function setup() {
    createCanvas(600, 600);
    background(51);
    car = new Car("", 300, 300, false);
    setEventHandlers();
}
var local = false;
var socket;
if(local)
    socket = io.connect("http://192.168.0.105:8080", {'forceNew': true});
else
    socket = io.connect("https://console.starter-us-east-1.openshift.com/console/project/car-game/overview:8080", {'forceNew': true});

var bullets = [];
var enemies = [];


function draw() {
    background(51);
    car.update();
    car.show();
    updatePosition(car.pos.x, car.pos.y);
    enemies.forEach(function (enemy) {
        enemy.show();
    });
    for (var i = bullets.length - 1; i >= 0; i--) {
        if (frameCount - bullets[i].start > 100) {
            bullets.splice(i, 1);
            continue;
        }
        bullets[i].bullet.update();
        bullets[i].bullet.show();
    }
}

function keyPressed() {
    if (keyCode == 32) {
        shoot();
    }
}
function mousePressed() {
    shoot();
}

function shoot() {
    var bullet = car.shoot();
    //socket.emit("shot", bullet);
    bullets.push({start: frameCount, bullet: bullet});
}


function updatePosition() {
    socket.emit("move player", {x: car.pos.x, y: car.pos.y, angle: car.angle});
}


function setEventHandlers() {
    // Socket connection successful
    socket.on('connect', onSocketConnected);

    // Socket disconnection
    socket.on('disconnect', onSocketDisconnect);

    // New player message received
    socket.on('new player', onNewPlayer);

    // Player move message received
    socket.on('move player', onMovePlayer);

    // Player removed message received
    socket.on('remove player', onRemovePlayer);

    // Player shot
    socket.on('shot', onPlayerShoot);
}

// Socket connected
function onSocketConnected() {
    // Reset enemies on reconnect
    enemies = [];

    // Send local player data to the game server
    socket.emit('new player', {x: car.pos.x, y: car.pos.y, angle: car.angle});
}

// Socket disconnected
function onSocketDisconnect() {
    console.log('Disconnected from socket server');
}

// New player
function onNewPlayer(data) {
    console.log('New player connected:', data.id);

    // Avoid possible duplicate players
    var duplicate = playerById(data.id);
    if (duplicate) {
        console.log('Duplicate player!');
        return;
    }

    // Add new player to the remote players array
    enemies.push(new Car(data.id, data.x, data.y, true));
}

// Move player
function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    // Player not found
    if (!movePlayer) {
        console.log('Player not found: ', data.id);
        return;
    }

    // Update player position
    movePlayer.pos.x = data.x;
    movePlayer.pos.y = data.y;
    movePlayer.angle = data.angle;
}

// Remove player
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    // Player not found
    if (!removePlayer) {
        console.log('Player not found: ', data.id);
        return;
    }
    enemies.splice(enemies.indexOf(removePlayer), 1);
}

// Player shot
function onPlayerShoot(data) {
    bullets = data;
}

// Find player by ID
function playerById(id) {
    for (var i = 0; i < enemies.length; i++)
        if (enemies[i].id === id)
            return enemies[i];
    return false
}
