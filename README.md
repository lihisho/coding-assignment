# Vi Coding Assignment 

__This project is designed to fetch Marvel movies cast data, map movies to different actors and identify Roles played by more than one actor and actors who played more than one Marvel character__

## Tools
- Jest for testing
- Axios for making HTTP requests
- Express as a web application framework
- NodeCache for in-memory caching
- Winston for logging

## Getting Started

### Install dependencies

Before starting to code, don't forget to install all dependencies.

```shell
yarn
```

### Running tests

Run all tests once:

```shell
yarn test
```

### How to use

#### Starting the server

To start the server, run:

```shell
API_KEY=<YOUR_API_KEY> yarn start
```

API_KEY is your key for https://developer.themoviedb.org API


#### Using Endpoints

The project includes several endpoints for fetching and processing movie data. Here are the main endpoints:

1. **Get Movies Per Actor**
   - **Endpoint**: `/moviesPerActor`
   - **Method**: GET
   - **Description**: Fetches movies for each actor.
   - **Response Example**:
     ```json
     {
       "actor 1": ["Test movie 1", "Test movie 2"],
       "actor 2": ["Test movie 3"]
     }
     ```

2. **Get Actors With Multiple Characters**
   - **Endpoint**: `/actorsWithMultipleCharacters`
   - **Method**: GET
   - **Description**: Fetches actors who have played more than one Marvel character.
   - **Response**:
     ```json
     {
       "actor 1": [
         { "movieName": "Test movie 1", "characterName": "Character 1" },
         { "movieName": "Test movie 2", "characterName": "Character 2" }
       ]
     }
     ```

3. **Get Characters With Multiple Actors**
   - **Endpoint**: `/charactersWithMultipleActors`
   - **Method**: POST
   - **Description**: Fetches characters that were played by more than one actor.
   - **Response**:
     ```json
     {
       "Character 1": [
         { "movieName": "Test movie 1", "actorName": "actor 1" },
         { "movieName": "Test movie 2", "actorName": "actor 1" }
       ]
     }
     ```



#### Project Structure

- src/controllers: Contains the controller functions for handling HTTP requests.
- src/services: Contains the service functions for business logic.
- src/dal: Contains the data access layer functions for interacting with external APIs.
- src/logger: Contains the logger configuration.
- tests: Contains the test files and mock data.


