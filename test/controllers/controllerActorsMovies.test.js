const {getMoviesPerActor: getMoviesPerActorService} = require("../../src/services/movieService");
const {getMoviesPerActor: getMoviesPerActorController} = require("../../src/controllers/movieActorController");
const httpMocks = require("node-mocks-http");

jest.mock('../../src/services/movieService');

test('Get movies per actor, return data and response gets OK', async () => {
    const actorMovieMapping = {};

    getMoviesPerActorService.mockImplementation(() => {
        return Promise.resolve(actorMovieMapping);
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getMoviesPerActorController(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(actorMovieMapping);
});


test('Get movies per actor when error occurs', async () => {
    getMoviesPerActorService.mockImplementation(() => {
        return Promise.reject(new Error("Something bad happened here"));
    });

    const [req, res, next] = [httpMocks.createRequest(), httpMocks.createResponse(), jest.fn()];
    await getMoviesPerActorController(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Internal Server Error"));
});
