const {movies, actors} = require("../../dataForQuestions");

const axios = require('axios').default;

const apiKey = process.env.API_KEY;

const baseUrl = 'https://api.themoviedb.org/3/';


const fetchMovieCast = async (movie) => {
    const movieId = movie[1];
    const url = `${baseUrl}movie/${movieId}/credits?api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data && data.cast) {
            return data.cast;
        } else {
            console.log(`No cast found for movie ID ${movieId}`);
            return [];
        }

    } catch (error) {
        console.log(`Failed to fetch movie credits for movie id: ${movieId}. errors: `, error);
        // throw error;
    }
};


exports.getMoviesPerActor = async (req, res, next) => {
    const actorMovieMapping = {};

    await Promise.all(Object.entries(movies).map(async (movie) => {
        const movieName = movie[0];
        const cast = await fetchMovieCast(movie);

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

    await Promise.all(Object.entries(movies).map(async (movie) => {
        const movieName = movie[0];
        const cast = await fetchMovieCast(movie);

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

    const result = {};
    for (const actor in actorCharacters) {
        if (actorCharacters[actor].length > 1) {
            result[actor] = actorCharacters[actor];
        }
    }

    res.status(200).json(result);
}


exports.getCharactersWithMultipleActors = async (req, res, next) => {
    const characterActors = {};
    const numOfActorsByCharacter= {};

    await Promise.all(Object.entries(movies).map(async (movie) => {
        const movieName = movie[0];
        const cast = await fetchMovieCast(movie);

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
