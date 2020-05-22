const {dateNow} = require('../tools');

const Game = {
    name: "",
    img: "",
    description: "",
    player: 0,
    board: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ],
    createdAt: dateNow(),

    printInformation: function() {
        console.log(`
            name: ${this.name}
            img: ${this.img}
            description: ${this.description}
            player: ${this.player}
            board: ${this.board}
            createdAt: ${this.createdAt}
            `);
    },
};
module.exports = {
    Game,
}