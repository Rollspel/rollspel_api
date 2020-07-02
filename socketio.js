const io = require('socket.io');

let users = [];
let gameboards = [{ socketID: "12345", gameboardID: "12345" }];
var board = [
    [9,9,9],
    [9,9,9],
    [9,9,9]];

setInterval(() => {
    console.log('users : ', users);
}, 10000);

const socketIO = {
    start: server => {
        const ioServer = io(server);
        ioServer.on('connection', socket => {
            
            console.log('connection', socket.id);


            socket.on('message', (message) => {
                console.log(message);
            });

            socket.on('receive_message', (message) => {
                socket.broadcast.emit(message);
            });

            // Add a new gameboard 
            socket.on('add_gameboard', (gameboardID) => {
                gameboards.push({ socketID: socket.id, gameboardID: gameboardID });
            });

            // Link user to a gameboard ID;
            socket.on('player_link_gameboard', (gameboardID) => {
                console.log('A player link his gameboard');
                if(gameboards.find(gameboard => gameboard.gameboardID === gameboardID)){
                    users.push({ socketID: socket.id, gameboardID: gameboardID });
                    socket.emit('player_link_gameboard_success');
                } else {
                    socket.emit('player_link_gameboard_fail');
                }
            });

            // Update board when tap is OK
            socket.on('player_tap', (data) => {
                console.log(data);
                console.log("Data.gameboardID : " + data.gameboardID);
                const user = users.find(user => user.gameboardID === data.gameboardID);
                if(user){
                    for (var i = 0; i < 3; i++){
                        for (var j = 0; j < 3; j++) {
                            if(data.board[i][j] !== 9){
                                board[i][j] = data.board[i][j];
                                ioServer.to(user.socketID).emit('player_receive_new_board', board);
                            }
                        }
                    }
                    // ioServer.to(user.socketID).emit('player_receive_new_board', board);
                }
            });


            // Don 't update board when tap is KO
            socket.on('player_tap_not_empty', (data) => {
                console.log(data);
                const user = users.find(user => user.gameboardID === data.gameboardID);
                if(user){
                    ioServer.to(user.socketID).emit('player_receive_tap_not_empty');
                }
            });

            // Player win 

            socket.on('player_win', (data) => {
                const user = users.find(user => user.gameboardID === data.gameboardID);
                if(user){
                    ioServer.to(user.socketID).emit('player_receive_winner', data.activePlayerIndex);
                }
            });


            socket.on('disconnect', () => {
                socket.broadcast.emit('message', socket.username + ' s\'est déconnecté.');
                console.log('disconnection : ', socket.id, socket.username);
            });
        });
    }
};

module.exports = socketIO;