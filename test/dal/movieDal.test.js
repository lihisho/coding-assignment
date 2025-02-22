const {fetchMovieCast} = require("../../src/dal/movieDal");
const {mockCreditsData} = require("./mockData");
const axios = require("axios");

//region Mocks
jest.mock('axios');
//endregion

//region Helper functions
function mockGetCastApi(movieId) {
    axios.get.mockImplementation((url) => {
        if (url.includes(`movie/${movieId}/credits`)) {
            return Promise.resolve({data: mockCreditsData, status: 200});
        }
        return Promise.reject(new Error('url not found'));
    });
}
//endregion

//region tests
test('fetches correct data from movie/${movieId}/credits endpoint', async () => {
    const movieId= "1111";

    mockGetCastApi(movieId);

    const result = await fetchMovieCast(movieId);
    expect(result).toEqual(mockCreditsData.cast);
});


test('fetches data from movie/${movieId}/credits endpoint with a movie that does not exist', async () => {
    const movieId= "1111";

    mockGetCastApi(movieId);

    var isError= false;
    try {
        const result = await fetchMovieCast("1234");
    }
    catch (error){
        isError = true;
    }
    expect(isError).toBeTruthy();
});

//TODO add test for cache
//endregion