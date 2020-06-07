const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {Game} = require('../BDD_objects/Game');
const {dateNow} = require('../tools');
const ObjectId = require('mongodb').ObjectId;


var express = require('express');
var router = express.Router();
const MONGODB_COLLEC = 'Games';

/**
 * @GET | GET all Game from database
 *
 * @Route("/getAll")
 */
router.get('/getAll', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const game = await db.collection(MONGODB_COLLEC).find().toArray();
        await client.close();
        res.status(200).send({
            error: null,
            game: game
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            game: []
        });
    });
});

/**
 * @POST | GET Game by id from database
 *
 * @Route("/getById")
 */
router.post('/getById', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const game = await db.collection(MONGODB_COLLEC).find({_id: ObjectId(req.body._id)}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            game: game
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            game: []
        });
    });
});

/**
 * @POST | GET Game with this quantity of player from database
 *
 * @Route("/getByPlayer")
 */
router.post('/getByPlayer', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const game = await db.collection(MONGODB_COLLEC).find({player: req.body.player}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            game: game
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            game: []
        });
    });
});

/**
 * @POST | Add Game on database
 *
 * @Route("/add")
 */
router.post('/add', async function(req, res){

    const game = Object.create(Game);
    game.name = req.body.name;
    game.img = req.body.img;
    game.description = req.body.description;
    game.player = req.body.player;
    game.board = req.body.board;
    const client = new MongoClient(MONGODB_URI);
    client.connect()
        .then(async function(response){

            const db = client.db(MONGODB_DBNAME);
            const gameWithSameName = await db.collection(MONGODB_COLLEC).find({ name: game.name }).toArray();

            if(gameWithSameName.length > 0){
                res.status(400).send({
                    error: 'This game already exists'
                });
            } else {
                await db.collection(MONGODB_COLLEC).insertOne(game);
                const gameInDb = await db.collection(MONGODB_COLLEC).find({createdAt: game.createdAt}).toArray();
                res.status(200).send({
                    error: null,
                    _id: ObjectId(gameInDb[0]._id),
                    name: gameInDb[0].name,
                    img: gameInDb[0].img,
                    description: gameInDb[0].description,
                    player: gameInDb[0].player,
                    board: gameInDb[0].board,
                    createdAt: gameInDb[0].createdAt
                });
            }
            await client.close();
        }).catch(function(error){
        res.status(500).send({
            error: error
        });
        client.close();
    });
});


module.exports = router;
