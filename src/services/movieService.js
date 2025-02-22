const {fetchMovieCast} = require("../dal/movieDal");


const getMoviesPerActor = async (movies, actors) => {
    const actorMovieMapping = {};

    await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
        const cast = await fetchMovieCast(movieId);

        cast.forEach(({name: actorName}) => {
            if (actors.includes(actorName)) {
                if (!actorMovieMapping[actorName]) {
                    actorMovieMapping[actorName] = [];
                }
                actorMovieMapping[actorName].push(movieName);
            }
        });
    }));

    return actorMovieMapping;
};

const getActorsWithMultipleCharacters = async (movies, actors) => {
    const actorCharacters = {};

    await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
        const cast = await fetchMovieCast(movieId);

        cast.forEach(({name: actorName, character}) => {
            if (actors.includes(actorName)) {
                const characters = character.split(' / ');
                actorCharacters[actorName] = actorCharacters[actorName] || [];
                characters.forEach(characterName => {
                    actorCharacters[actorName].push({movieName, characterName});
                });
            }
        });
    }));

    const result = {};
    for (const actor in actorCharacters) {
        if (actorCharacters[actor].length > 1) {
            result[actor] = actorCharacters[actor];
        }
    }

    return result;
};

const getCharactersWithMultipleActors = async (movies, actors) => {
    const characterActors = {};
    const numOfActorsByCharacter = {};

    await Promise.all(Object.entries(movies).map(async ([movieName, movieId]) => {
        const cast = await fetchMovieCast(movieId);
        processCastForCharacterActors(cast, characterActors, movieName, numOfActorsByCharacter, actors);
    }));

    const result = {};
    for (const character in numOfActorsByCharacter) {
        if (numOfActorsByCharacter[character].length > 1) {
            result[character] = characterActors[character];
        }
    }

    return result;
};

const processCastForCharacterActors = (cast, characterActors, movieName, numOfActorsByCharacter, actors) => {
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
    });
};


module.exports = {getMoviesPerActor, getActorsWithMultipleCharacters, getCharactersWithMultipleActors};