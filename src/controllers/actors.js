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

}


exports.getCharactersWithMultipleActors = async (req, res, next) => {

}
