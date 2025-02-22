const {mockFetchMovieCastDataMoviesPerActor} = require("./mockData/mockFetchMovieCastDataMoviesPerActor");
const {getMoviesPerActor, getActorsWithMultipleCharacters, getCharactersWithMultipleActors} = require("../../src/services/movieService");
const {fetchMovieCast} = require("../../src/dal/movieDal");
const {mockFetchMovieCastDataActorCharacters} = require("./mockData/mockFetchMovieCastDataActorCharacters");
const {mockFetchMovieCastDataMoviesPerActorMissingMovie} = require("./mockData/mockFetchMovieCastDataMoviesPerActorMissingMovie");
const {mockFetchMovieCastDataCharacterActors} = require("./mockData/mockFetchMovieCastDataCharacterActors");

//refion setup
const movies = {
    'Test movie 1': 1,
    'Test movie 2': 2,
    'Test movie 4': 4
}
const actors = [
    'actor 1',
    'actor 2',
    'actor 4'
]
//endregion

//region Mocks
jest.mock('../../src/dal/movieDal');
//endregion

//region tests
test('fetches movies per actor', async () => {
    const actorMovieMapping = {
        "actor 1":[
            "Test movie 1",
            "Test movie 2"
        ],
        "actor 2":[
            "Test movie 1"
        ],
        "actor 4":[
            "Test movie 4"
        ]
    }

    fetchMovieCast.mockImplementation((movieId) => {
            if (mockFetchMovieCastDataMoviesPerActor.hasOwnProperty(movieId)) {
                return Promise.resolve(mockFetchMovieCastDataMoviesPerActor[movieId])
            }
            return Promise.reject(new Error(`movie with id ${movieId} not found.`));
        }
    );

    const result = await getMoviesPerActor(movies,actors);

    expect(result).toEqual(actorMovieMapping);
    expect(result["actor 3"]).toBeUndefined();
    expect(result["actor 1"]).not.toContain("Test movie 3");
});

test('fetches movies per actor when one movie doesnt exist in data', async () => {
    fetchMovieCast.mockImplementation((movieId) => {
            if (mockFetchMovieCastDataMoviesPerActorMissingMovie.hasOwnProperty(movieId)) {
                return Promise.resolve(mockFetchMovieCastDataMoviesPerActorMissingMovie[movieId])
            }
            return Promise.reject(new Error(`movie with id ${movieId} not found.`));
        }
    );
    try{
        await getMoviesPerActor(movies,actors);
    }
    catch (error){
        isError = true;
    }
    expect(isError).toBeTruthy();
});

test('fetches actors with multiple characters', async () => {
    const actorCharacters = {
        "actor 1":[
            {movieName: "Test movie 1", characterName: "Char1"},
            {movieName: "Test movie 1", characterName: "Char2"},
            {movieName: "Test movie 2", characterName: "Char3"}
        ],
        "actor 2":[
            {movieName: "Test movie 1", characterName: "Char4"},
            {movieName: "Test movie 2", characterName: "Char5"},
        ]
    }

    fetchMovieCast.mockImplementation((movieId) => {
        return Promise.resolve(mockFetchMovieCastDataActorCharacters[movieId])}
    );

    const result = await getActorsWithMultipleCharacters(movies,actors);

    //tests split characters
    expect(result).toEqual(actorCharacters);
    expect(result["actor 4"]).toBeUndefined();
});

test('fetches characters with multiple actors', async () => {
    const characterActors = {
        "Char1":[
            {movieName: "Test movie 1", actorName: "actor 1"},
            {movieName: "Test movie 2", actorName: "actor 2"},
            {movieName: "Test movie 4", actorName: "actor 2"}
        ],
        "Char2":[
            {movieName: "Test movie 1", actorName: "actor 1"},
            {movieName: "Test movie 4", actorName: "actor 4"},
        ]
    }

    fetchMovieCast.mockImplementation((movieId) => {
        return Promise.resolve(mockFetchMovieCastDataCharacterActors[movieId])}
    );

    const result = await getCharactersWithMultipleActors(movies,actors);

    //also tests split characters
    expect(result).toEqual(characterActors);
    expect(result["Char3"]).toBeUndefined();
    expect(result["Char1"]).toHaveLength(3);
});


//endregion