const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {dateNow} = require('../tools');
const ObjectId = require('mongodb').ObjectId;

var express = require('express');
var router = express.Router();
const MONGODB_COLLEC = 'Gameboard';

/**
 * @GET | GET all Gameboard from database
 *
 * @Route("/getAll")
 */
router.get('/getAll', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const gameboard = await db.collection(MONGODB_COLLEC).find().toArray();
        await client.close();
        res.status(200).send({
            error: null,
            gameboard: gameboard
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            gameboard: []
        });
    });
});

/**
 * @POST | GET Gameboard by id from database
 *
 * @Route("/getById")
 */
router.post('/getById', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const gameboard = await db.collection(MONGODB_COLLEC).find({_id: ObjectId(req.body._id)}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            gameboard: gameboard
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            gameboard: []
        });
    });
});

/**
 * @POST | Add Gameboard on database
 *
 * @Route("/add")
 */
router.post('/add', async function(req, res){

    const gameboardID = req.body.gameboardID,
        createdAt = dateNow();
    const client = new MongoClient(MONGODB_URI);
    client.connect()
        .then(async function(response){
            const db = client.db(MONGODB_DBNAME);
            const newGameboard = {
                gameboardID: gameboardID,
                createdAt: createdAt
            };
            await db.collection(MONGODB_COLLEC).insertOne(newGameboard);
            const gameboardInDb = await db.collection(MONGODB_COLLEC).find({createdAt: createdAt}).toArray();
            res.status(200).send({
                error: null,
                _id: ObjectId(gameboardInDb[0]._id),
                gameboardID: gameboardInDb[0].gameboardID,
                createdAt: gameboardInDb[0].createdAt
            });
            await client.close();
        }).catch(function(error){
        res.status(500).send({
            error: error
        });
        client.close();
    });
});


module.exports = router;