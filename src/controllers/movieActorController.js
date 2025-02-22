const {movies, actors} = require("../../dataForQuestions");
const logger = require("../utils/logger");
const {
    getMoviesPerActor,
    getActorsWithMultipleCharacters,
    getCharactersWithMultipleActors
} = require("../services/movieService");

const INTERNAL_SERVER_ERROR = new Error('Internal Server Error')

exports.getMoviesPerActor = async (req, res, next) => {
    try {
        const actorMovieMapping = await getMoviesPerActor(movies, actors);
        res.status(200).json(actorMovieMapping);
    } catch (error) {
        logger.warn(`Failed to fetch movies per actor: `, error);
        return next(INTERNAL_SERVER_ERROR);
    }
};

exports.getActorsWithMultipleCharacters = async (req, res, next) => {
    try {
        const result = await getActorsWithMultipleCharacters(movies, actors);
        res.status(200).json(result);
    } catch (error) {
        logger.warn(`Failed to fetch actors with multiple characters: `, error);
        return next(INTERNAL_SERVER_ERROR);
    }
}

exports.getCharactersWithMultipleActors = async (req, res, next) => {
    try {
        const result = await getCharactersWithMultipleActors(movies, actors);
        res.status(200).json(result);
    } catch (error) {
        logger.warn(`Failed to fetch characters with multiple actors: `, error);
        return next(INTERNAL_SERVER_ERROR);
    }
}

