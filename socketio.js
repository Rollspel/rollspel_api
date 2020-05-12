const io = require('socket.io');

const socketIO = {
    start: server => {
        const ioServer = io(server);
        ioServer.on('connection', socket => {
            console.log('connection : ', socket.id);
            socket.on('disconnect', () => {
            console.log('disconnection : ', socket.id);
            });
        });
    }
};

module.exports = socketIO;