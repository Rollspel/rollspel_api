const {dateNow} = require('../tools');
const{Player} = require('./Player');
const{Game} = require('./Game');

const Party = {
    finalBoardState: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ],
    players: [Player],
    winner: Player,
    rounds: 0,
    game: Game,
    createdAt: dateNow(),

    printInformation: function() {
        console.log(`
            finalBoardState: ${this.finalBoardState}
            players: ${this.players}
            winner: ${this.winner.printInformation()}
            rounds: ${this.rounds}
            game: ${this.game}
            createdAt: ${this.createdAt}
            `);
    },
};
module.exports = {
    Party,
}