var util = require('util')
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = 8080;

app.use(express.static('public'));

var cars = [];
var bullets = [];

server.listen(port, function () {
    console.log("Server has started on port " + port + "!");
});

app.get("/", function (req, res) {
});


io.on("connection", onSocketConnection);

// New socket connection
function onSocketConnection(client) {
    util.log('New player has connected: ' + client.id)

    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);

    // Listen for new player message
    client.on('new player', onNewPlayer);

    // Listen for move player message
    client.on('move player', onMovePlayer);

    // Listen for player shots
    client.on('shot', onPlayerShoot);
}

// Socket client has disconnected
function onClientDisconnect() {
    util.log('Player has disconnected: ' + this.id);

    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log('Player not found: ' + this.id);
        return;
    }

    // Remove player from players array
    cars.splice(cars.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
}

// New player has joined
function onNewPlayer(data) {
    // Create a new player
    var newPlayer = {x: data.x, y: data.y};
    newPlayer.id = this.id;

    // Broadcast new player to connected socket clients
    this.broadcast.emit('new player', {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y
    });

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < cars.length; i++) {
        existingPlayer = cars[i];
        ;
        this.emit('new player', {
            id: existingPlayer.id,
            x: existingPlayer.x,
            y: existingPlayer.y
        });
    }

    // Add new player to the players array
    cars.push(newPlayer);
}

// Player has moved
function onMovePlayer(data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log('Player not found: ' + this.id);
        return
    }

    // Update player position
    movePlayer.x = data.x;
    movePlayer.y = data.y;
    movePlayer.angle = data.angle;

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {
        id: movePlayer.id,
        x: movePlayer.x,
        y: movePlayer.y,
        angle: movePlayer.angle
    })
}

// Player shot
function onPlayerShoot(data) {
    console.log("Bullet");
    bullets.push(data);
    // Broadcast updated position to connected socket clients
    this.broadcast.emit('shot', bullets);
}


// Find player by ID
function playerById(id) {
    for (var i = 0; i < cars.length; i++)
        if (cars[i].id === id)
            return cars[i];
    return false;
}