<img src="doc/logo.png" width=250 height=250>

# WithB

An *IRL* interactive roleplay game to learn how to cheat on your relatives. 

> Who is that ho* Bryan ?!

## Rules

1) Each person is in a relationship with 2 people.

2) Everyone knows the 2 ones they are in a relationship with like if you were part of a circle where you only know the person on your right and your left.

3) You (and your relations) have to guess with whom they are being cheated on with.

4) You have at least 1 common trait with the ones you are in a relationship with.

## Example

This is an example of a solution, only the game knows this graph.
Here, there are 5 people playing.

<img src="doc/circle.png">

In this example, Léo has to find with whom Marie is cheating on him (the answer is Maël) and with whom Meziane is cheating on him too (the answer is Enora)

Meziane has to find with whom Léo is cheating on him (Marie) and with whom Enora is cheating on him too (Maël).

The capital letters are **personal traits**.
You have at leats **1 common trait** with a person you are in a relationship with.

# Contributing

## Installation
- You need NodeJs (tested on v15)
- Clone the repository and navigate to the folder
- Install the dependencies : `npm install`
- Run the development server : `npm run dev`
    - If nodemon crashes, you might install ts-node globally : `npm i -g ts-node` or upgrade to NodeJs 15+.  
- Navigate to `http://localhost:8080/` or run the test script

## Testing
You can simulate a game with 10 players and see both the manager and the player view.

<img src="doc/test.png">

- Run the test script to create a fake game : `npm run test`

## App structure

The whole project is a single express.js server. You can create and operate with multiple games in parallel with only 1 instance running.

- `/src` 
    - `index.ts` - App entrypoint, starts the server
    - `router.ts` - Determines the behavior of the server according to the URL of the request
    - `game.ts`- Class that encapsulates the data and methods of a single running game
    - `generator.ts` - A toolbox/helper to generate the graph
    - `io.ts` - Socket.io specific server behaviors. Add here in-game interactions between the server and the client.
    - `/views`
        - `join.html` - Landing interface
        - `manager.html` - Game manager interface
        - `player.html` - Player interface

## Adding rules/behaviours
The socket.io library allows to exchange messages between the server and clients (game player, game manager). Learn more on the [socket.io documentation](https://socket.io/docs/v3/how-it-works/)

When a player joins a game, his web browser loads the `player.html` file (as defined in `router.ts`). This html files includes the socket.io script of our server.

```html
<script src="/socket.io/socket.io.js"></script>
<script>
    // Open socket.io connection and parse URL to get gameId and nickname
    const socket = io()
</script>
```

The browser of the player will now execute the script and create socket.io connection with the server. You can interact and send/receive messages through this connection using the `socket` variable.

client:
```js
// Notify the server that we are part of a specific game
socket.emit('joinRoom', gameId);
```

This commands emits a `joinRoom` event with a content (`gameId`), those informations will be catched by the server in the `io.ts` file.

server:
```js
socket.on('joinRoom', room => { // room = gameId
    // Get the corresponding game if it exists, else leave
    if (!checkExists(games, room, socket)) return
    socket.join(room)
})
```

And that's all, you can now create your own interactions by adding `socket.emit` and `socket.on` on both server side (the `io.ts file`) and the client side (`player.html` and `manager.html`)
