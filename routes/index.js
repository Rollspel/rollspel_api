const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {getRandomInt} = require('../tools');
const {dateNow} = require('../tools');


var express = require('express');
var router = express.Router();
const MONGODB_COLLEC = 'Number';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/**
 * @GET | Test function
 *
 * @Route("/rand")
 */
router.get('/rand', async function (req, res, next) {

    res.status(200).send({
        error: null,
        number: getRandomInt(0, 100)
    });

});

/**
 * @POST | CREATE random number on bdd (Test function)
 *
 * @Route("/add")
 */
router.post('/add', async function(req, res){

    const client = new MongoClient(MONGODB_URI);
    client.connect()
        .then(async function(response){

            const db = client.db(MONGODB_DBNAME);
                const randomNumber = {
                    "randomNumber": getRandomInt(0,100),
                    createdAt: dateNow()
                };
            console.log(randomNumber);
                await db.collection(MONGODB_COLLEC).insertOne(randomNumber);
                const numberInDb = await db.collection(MONGODB_COLLEC).find({randomNumber: randomNumber.randomNumber}).toArray();
                res.status(200).send({
                    error: null,
                    randonNumber: numberInDb[0].name,
                    createdAt: numberInDb[0].createdAt
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
