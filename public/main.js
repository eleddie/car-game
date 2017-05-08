var car;
var myId;
function setup() {
    createCanvas(600, 600);
    background(51);
    car = new Car(300, 300);
    setEventHandlers();
}

var socket = io.connect("http://192.168.0.105:8080", {'forceNew': true});
var enemies = [];


function draw() {
    background(51);
    car.move();
    updatePosition(car.pos.x, car.pos.y);
    fill(255);
    ellipse(car.pos.x, car.pos.y, 20, 20);
    enemies.forEach(function (enemy) {
        fill(250, 30, 40);
        ellipse(enemy.x, enemy.y, 20, 20);
    });
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        car.movement[0] = true;
    }
    if (keyCode === RIGHT_ARROW) {
        car.movement[1] = true;
    }
    if (keyCode === DOWN_ARROW) {
        car.movement[2] = true;
    }
    if (keyCode === LEFT_ARROW) {
        car.movement[3] = true;
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        car.movement[0] = false;
    }
    if (keyCode === RIGHT_ARROW) {
        car.movement[1] = false;
    }
    if (keyCode === DOWN_ARROW) {
        car.movement[2] = false;
    }
    if (keyCode === LEFT_ARROW) {
        car.movement[3] = false;
    }
}

function updatePosition(x, y) {
    socket.emit("move player", {id: myId, x: x, y: y});
}


function setEventHandlers() {
    // Socket connection successful
    socket.on('connect', onSocketConnected)

    // Socket disconnection
    socket.on('disconnect', onSocketDisconnect)

    // New player message received
    socket.on('new player', onNewPlayer)

    // Player move message received
    socket.on('move player', onMovePlayer)

    // Player removed message received
    socket.on('remove player', onRemovePlayer)
}

// Socket connected
function onSocketConnected() {
    console.log('Connected to socket server')

    // Reset enemies on reconnect
    enemies = []

    // Send local player data to the game server
    socket.emit('new player', {x: car.x, y: car.y})
}

// Socket disconnected
function onSocketDisconnect() {
    console.log('Disconnected from socket server')
}

// New player
function onNewPlayer(data) {
    console.log('New player connected:', data.id)

    // Avoid possible duplicate players
    var duplicate = playerById(data.id)
    if (duplicate) {
        console.log('Duplicate player!')
        return
    }

    // Add new player to the remote players array
    enemies.push({id: data.id, x: data.x, y: data.y})
}

// Move player
function onMovePlayer(data) {
    var movePlayer = playerById(data.id)

    // Player not found
    if (!movePlayer) {
        console.log('Player not found: ', data.id)
        return
    }

    // Update player position
    movePlayer.x = data.x
    movePlayer.y = data.y;
}

// Remove player
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id)
    // Player not found
    if (!removePlayer) {
        console.log('Player not found: ', data.id)
        return
    }
    enemies.splice(enemies.indexOf(removePlayer), 1)
}

// Find player by ID
function playerById(id) {
    for (var i = 0; i < enemies.length; i++)
        if (enemies[i].id === id)
            return enemies[i]
    return false
}