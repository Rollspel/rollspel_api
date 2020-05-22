const io = require('socket.io');

const socketIO = {
    start: server => {
        const ioServer = io(server);
        ioServer.on('connection', socket => {
            console.log('connection : ', socket.id);
            socket.emit('message', "vous êtes bien connecté !");
            socket.broadcast.emit('message', 'Un autre client vient de se connecter !');

            // Quand le serveur reçoit un signal de type "message" du client
            socket.on('message', function (message) {
                console.log(socket.username + " me parle ! Il me dit : " + message);

            });

            //Stocker des informations dans un socket. Genre un pseudo
            socket.on('petit_nouveau', function(username) {
                socket.username = username;
            });

            socket.on('disconnect', () => {
            console.log('disconnection : ', socket.id, socket.username);
            });
        });
    }
};

module.exports = socketIO;