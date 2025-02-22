const express = require('express');
const movieActorController = require("../controllers/movieActorController");
const router = express.Router();


router.get('/moviesPerActor', movieActorController.getMoviesPerActor);

router.get('/actorsWithMultipleCharacters', movieActorController.getActorsWithMultipleCharacters)

router.get('/charactersWithMultipleActors', movieActorController.getCharactersWithMultipleActors)


module.exports = router;