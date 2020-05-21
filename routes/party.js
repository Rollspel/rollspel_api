const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {dateNow} = require('../tools');
const ObjectId = require('mongodb').ObjectId;

var express = require('express');
var router = express.Router();
const MONGODB_COLLEC = 'Party';

/**
 * @GET | GET all Party from database
 *
 * @Route("/getAll")
 */
router.get('/getAll', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const party = await db.collection(MONGODB_COLLEC).find().toArray();
        await client.close();
        res.status(200).send({
            error: null,
            party: party
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            party: []
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
        const party = await db.collection(MONGODB_COLLEC).find({_id: ObjectId(req.body._id)}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            party: party
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            party: []
        });
    });
});


/**
 * @GET | GET Party by element(s)
 *
 * @Route("/getByElement")
 */
router.post('/getByElement', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    console.log(req.body);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const party = await db.collection(MONGODB_COLLEC).find(req.body).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            party: party
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            party: []
        });
    });
});


/**
 * @POST | Add Party on database
 *
 * @Route("/add")
 */
router.post('/add', async function(req, res){

    const finalBoardState = req.body.finalBoardState,
        players = req.body.players,
        winner = req.body.winner,
        rounds = req.body.rounds,
        game = req.body.game,
        createdAt = dateNow();
    const client = new MongoClient(MONGODB_URI);
    client.connect()
        .then(async function(response){
            const db = client.db(MONGODB_DBNAME);
            const newParty = {
                finalBoardState: finalBoardState,
                players: players,
                winner: winner,
                rounds: rounds,
                game: game,
                createdAt: createdAt
            };
            await db.collection(MONGODB_COLLEC).insertOne(newParty);
            const partyInDb = await db.collection(MONGODB_COLLEC).find({createdAt: createdAt}).toArray();
            res.status(200).send({
                error: null,
                _id: ObjectId(partyInDb[0]._id),
                finalBoardState: partyInDb[0].finalBoardState,
                players: partyInDb[0].players,
                winner: partyInDb[0].winner,
                rounds: partyInDb[0].rounds,
                game: partyInDb[0].game,
                createdAt: partyInDb[0].createdAt
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