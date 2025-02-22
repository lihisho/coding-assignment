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
        logger.error(`Failed to fetch movie cast for movie id: ${movieId}. errors: `, error);
        throw error;
    }
}

module.exports = {fetchMovieCast};
