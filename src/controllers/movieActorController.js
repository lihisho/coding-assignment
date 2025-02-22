const {movies, actors} = require("../../dataForQuestions");
const logger = require("../utils/logger");
const cache = require("../utils/cache");
const axios = require("../utils/axiosConfig");


const apiKey = process.env.API_KEY;

const baseUrl = 'https://api.themoviedb.org/3/';

const fetchMovieCast = async (movieId) => {
    const cacheKey = `fetchMovieCast:${movieId}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
        logger.debug(`Returning cached result for ${movieId}`);
        return cachedResult;
    }

    const url = `${baseUrl}movie/${movieId}/credits?api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        cache.set(cacheKey, data.cast);
        return data.cast;
    } catch (error) {
        if (error.response) {
            logger.error(`API responded with status ${error.response.status} for movie ID ${movieId}: ${error.response.data}`);
        } else if (error.request) {
            logger.error(`No response received for movie ID ${movieId}: ${error.request}`);
        } else {
            logger.error(`Error in setting up request for movie ID ${movieId}: ${error.message}`);
        }
    }
}


exports.getMoviesPerActor = async (req, res, next) => {
    const actorMovieMapping = {};
    try {
        await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
            const cast = await fetchMovieCast(movieId);

            cast.forEach(({name: actorName}) => {
                if (actors.includes(actorName)) {
                    if (!actorMovieMapping[actorName]) {
                        actorMovieMapping[actorName] = [];
                    }
                    actorMovieMapping[actorName].push(movieName)
                }
            });
        }));
        res.status(200).json(actorMovieMapping);
    } catch (error) {
        logger.warn(`Failed to fetch movies per actor: `, error);
        return next(new Error('Internal Server Error'));
    }

}

exports.getActorsWithMultipleCharacters = async (req, res, next) => {
    const actorCharacters = {};
    try {
        await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
            const cast = await fetchMovieCast(movieId);

            cast.forEach(({name: actorName, character}) => {
                    if (actors.includes(actorName)) {
                        const characters = character.split(' / ');
                        actorCharacters[actorName] = actorCharacters[actorName] || []
                        characters.forEach(characterName => {
                            actorCharacters[actorName].push({movieName, characterName});
                        });
                    }
                }
            );
        }));

        const result = {};
        for (const actor in actorCharacters) {
            if (actorCharacters[actor].length > 1) {
                result[actor] = actorCharacters[actor];
            }
        }
        res.status(200).json(result);

    } catch (error) {
        logger.warn(`Failed to fetch actors with multiple characters: `, error);
        return next(new Error('Internal Server Error'));
    }
}


function processCastForCharacterActors(cast, characterActors, movieName, numOfActorsByCharacter) {
    cast.forEach(({name: actorName, character}) => {
            if (actors.includes(actorName)) {
                const characters = character.split(' / ');
                characters.forEach(characterName => {
                    (characterActors[characterName] = characterActors[characterName] || []).push({
                        movieName,
                        actorName
                    }); //if the characterActors doesn't include the Character, initialize with [].

                    numOfActorsByCharacter[characterName] = numOfActorsByCharacter[characterName] || [];
                    if (!numOfActorsByCharacter[characterName].includes(actorName)) {
                        numOfActorsByCharacter[characterName].push(actorName);
                    }
                });
            }
        }
    );
}

exports.getCharactersWithMultipleActors = async (req, res, next) => {
    const characterActors = {};
    const numOfActorsByCharacter = {};
    try {
        await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
            const cast = await fetchMovieCast(movieId);
            processCastForCharacterActors(cast, characterActors, movieName, numOfActorsByCharacter);
        }));

        const result = {};
        for (const character in numOfActorsByCharacter) {
            if (numOfActorsByCharacter[character].length > 1) {
                result[character] = characterActors[character];
            }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.warn(`Failed to fetch characters with multiple actors: `, error);
        return next(new Error('Internal Server Error'));
    }
}

