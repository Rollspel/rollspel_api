const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {dateNow} = require('../tools');
const ObjectId = require('mongodb').ObjectId;


var express = require('express');
var router = express.Router();
const MONGODB_COLLEC = 'Players';

/**
 * @GET | GET all Players from database
 *
 * @Route("/getAll")
 */
router.get('/getAll', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const player = await db.collection(MONGODB_COLLEC).find().toArray();
        await client.close();
        res.status(200).send({
            error: null,
            player: player
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            player: []
        });
    });
});

/**
 * @POST | GET Player by id from database
 *
 * @Route("/getById")
 */
router.post('/getById', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const player = await db.collection(MONGODB_COLLEC).find({_id: ObjectId(req.body._id)}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            player: player
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            player: []
        });
    });
});

/**
 * @POST | GET Player by username from database
 *
 * @Route("/getByUsername")
 */
router.post('/getByUsername', async function(req, res, next) {

    const client = new MongoClient(MONGODB_URI);
    client.connect().then(async function(response) {
        const db = client.db(MONGODB_DBNAME);
        const player = await db.collection(MONGODB_COLLEC).find({username: req.body.username}).toArray();
        await client.close();
        res.status(200).send({
            error: null,
            player: player
        });
    }).catch(function (error) {
        console.log("Error server " + error.stack);
        res.status(500).send({
            error: error.stack,
            player: []
        });
    });
});

/**
 * @POST | Add Player on database
 *
 * @Route("/add")
 */
router.post('/add', async function(req, res){

    const username = req.body.username,
        localID = req.body.localID,
        createdAt = dateNow();
    const client = new MongoClient(MONGODB_URI);
    client.connect()
        .then(async function(response){
            const db = client.db(MONGODB_DBNAME);
            const newPlayer = {
                username: username,
                localID: localID,
                createdAt: createdAt
            };
            await db.collection(MONGODB_COLLEC).insertOne(newPlayer);
            const playerInDb = await db.collection(MONGODB_COLLEC).find({createdAt: createdAt}).toArray();
            res.status(200).send({
                error: null,
                _id: ObjectId(playerInDb[0]._id),
                username: playerInDb[0].username,
                localID: playerInDb[0].localID,
                createdAt: playerInDb[0].createdAt
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