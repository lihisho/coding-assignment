const {movies, actors} = require("../../dataForQuestions");
const logger = require("../logger/logger");
const cache = require("../cache");

const axios = require('axios').default;


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
        logger.error(`Failed to fetch movie credits for movie id: ${movieId}. errors: `, error);
        throw error;
    }
};


exports.getMoviesPerActor = async (req, res, next) => {
    const actorMovieMapping = {};

    await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
        const cast = await fetchMovieCast(movieId);

        cast.forEach((actor) => {
            if (actors.includes(actor.name)) {
                if (!actorMovieMapping[actor.name]) {
                    actorMovieMapping[actor.name] = [];
                }
                actorMovieMapping[actor.name].push(movieName)
            }
        });
    }));

    res.status(200).json(actorMovieMapping);

}

exports.getActorsWithMultipleCharacters = async (req, res, next) => {
    const actorCharacters = {};

    try {
        await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
            const cast = await fetchMovieCast(movieId);

            cast.forEach((actor) => {
                    if (actors.includes(actor.name)) {
                        const characters = actor.character.split(' / ');
                        if (!actorCharacters[actor.name]) {
                            actorCharacters[actor.name] = [];
                        }
                        characters.forEach(character => {
                            actorCharacters[actor.name].push({movieName, character});
                        });
                    }
                }
            );
        }));
    } catch (error) {
        logger.warn(`Failed to fetch actors for multiple characters: `, error);
        const err = new Error('Internal Server Error');
        err.status = 500;
        next(err);
        return;
        // res.status(500).json({message: "Internal Server Error"});
    }


    const result = {};
    for (const actor in actorCharacters) {
        if (actorCharacters[actor].length > 1) {
            result[actor] = actorCharacters[actor];
        }
    }

    res.status(200).json(result);
}


exports.getCharactersWithMultipleActors = async (req, res,next) => {
    const characterActors = {};
    const numOfActorsByCharacter= {};

    await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
        const cast = await fetchMovieCast(movieId);

        cast.forEach((actor) => {
                const actorName = actor.name;
                if (actors.includes(actorName)) {
                    const characters = actor.character.split(' / ');
                    characters.forEach(character => {
                        if (!characterActors[character]) {
                            characterActors[character] = [];
                        }
                        characterActors[character].push({movieName, actorName});
                        if(!numOfActorsByCharacter[character]){
                            numOfActorsByCharacter[character] = [];
                        }
                        if (!numOfActorsByCharacter[character].includes(actorName)) {
                            numOfActorsByCharacter[character].push(actorName);
                        }
                    });
                }
            }
        );
    }));

    const result = {};
    for (const character in numOfActorsByCharacter) {
        if (numOfActorsByCharacter[character].length > 1) {
            result[character] = characterActors[character];
        }
    }

    res.status(200).json(result);
}
