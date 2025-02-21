const express = require('express');
const ActorsController = require("../controllers/actors");
const router = express.Router();


router.get('/moviesPerActor', ActorsController.getMoviesPerActor);

router.get('/actorsWithMultipleCharacters', ActorsController.getActorsWithMultipleCharacters)

router.get('/charactersWithMultipleActors', ActorsController.getCharactersWithMultipleActors)


module.exports = router;