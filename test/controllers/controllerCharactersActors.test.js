const {getCharactersWithMultipleActors: getCharactersWithMultipleActorsService} = require("../../src/services/movieService");
const {getCharactersWithMultipleActors: getCharactersWithMultipleActorsController} = require("../../src/controllers/movieActorController");
const httpMocks = require("node-mocks-http");

jest.mock('../../src/services/movieService');

test('Get characters with multiple actors, return data and response gets OK', async () => {
    const actorMovieMapping = {};

    getCharactersWithMultipleActorsService.mockImplementation(() => {
        return Promise.resolve(actorMovieMapping);
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getCharactersWithMultipleActorsController(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(actorMovieMapping);
});


test('Get characters with multiple actors when error occurs', async () => {
    getCharactersWithMultipleActorsService.mockImplementation(() => {
        return Promise.reject(new Error("Something bad happened here"));
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getCharactersWithMultipleActorsController(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Internal Server Error"));
});
