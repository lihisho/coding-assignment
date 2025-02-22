const {getActorsWithMultipleCharacters: getActorsWithMultipleCharactersService} = require("../../src/services/movieService");
const {getActorsWithMultipleCharacters: getActorsWithMultipleCharactersController} = require("../../src/controllers/movieActorController");
const httpMocks = require("node-mocks-http");

jest.mock('../../src/services/movieService');

test('Get actors with multiple characters, return data and response gets OK', async () => {
    const actorMovieMapping = {};

    getActorsWithMultipleCharactersService.mockImplementation(() => {
        return Promise.resolve(actorMovieMapping);
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getActorsWithMultipleCharactersController(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(actorMovieMapping);
});


test('Get actors with multiple characters when error occurs', async () => {
    getActorsWithMultipleCharactersService.mockImplementation(() => {
        return Promise.reject(new Error("Something bad happened here"));
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getActorsWithMultipleCharactersController(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Internal Server Error"));
});
