const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {MongoClient} = require('../tools');
const {getRandomInt} = require('../tools');


var express = require('express');
var router = express.Router();

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

module.exports = router;
