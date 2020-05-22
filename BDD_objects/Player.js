const {dateNow} = require('../tools');


const Player = {
    username: "",
    localID: "",
    createdAt: dateNow(),

    printInformation: function() {
        console.log(`
            Username: ${this.username}
            localID: ${this.localID}
            createdAt: ${this.createdAt}
            `);
    },
};

module.exports = {
    Player,
}