const io = require('socket.io');

let users = [];
let gameboards = [{ socketID: "12345", gameboardID: "12345" }];

setInterval(() => {
    console.log('users : ', users);
}, 10000);

const socketIO = {
    start: server => {
        const ioServer = io(server);
        ioServer.on('connection', socket => {

            const board = [
                [9,9,9],
                [9,9,9],
                [9,9,9]
            ];
            
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
                const user = users.find(user => user.gameboardID === data.gameboardID);
                if(user){
                    board = data.board
                    ioServer.to(user.socketID).emit('player_receive_new_board', {user, board});
                    // ioServer.to(user.socketID).emit('player_receive_new_board', board);
                }
            });

            socket.on('send_player_win', data => {
                const gameboard = gameboards.find(gameboard => gameboard.gameboardID === data.gameboardID);
                ioServer.to(gameboard.socketID).emit('receive_player_win', data.activePlayerIndex);
            });
            

            socket.on('disconnect', () => {
                socket.broadcast.emit('message', socket.username + ' s\'est déconnecté.');
                users = users.filter(user => user.socketID !== socket.id);
                gameboards
                console.log('disconnection : ', socket.id, socket.username);
            });
        });
    }
};

module.exports = socketIO;