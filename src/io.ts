import { maxHeaderSize } from "http";
import { MessageChannel } from "node:worker_threads";
import { Server, Socket } from "socket.io";
import { Game } from "./game";

export type ClientMessage = {
  gameId: string,
  content: any,
  emitter: string
}
export type ManagerEvent = {
  gameId: string,
  event: any,
  chosenPlayers: string[]
}

export type RewardPenalty = {
  gameId: string,
  content: string,
  receiver: string,
  target: string
}

function checkExists(games: any, gameId: string, socket: Socket) {
  if (!(Object.keys(games).includes(gameId))) {
    socket.emit('doesnt exists')
    socket.disconnect()
    return false
  }
  return true
}

export function io(httpServer: any, games: any) {
  const io = new Server(httpServer)

  io.on('connection', socket => {

    socket.on('joinRoom', room => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, room, socket)) return
      socket.join(room)
    })

    socket.on('hello', (msg: ClientMessage) => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]
      const nickname = msg.content
      // Add the player to lobby
      game.addToLobby(nickname)
      socket.to(msg.gameId).emit('hello', nickname)
      console.log(`[${msg.gameId}] ${nickname} said hello`)
    })

    socket.on('getReport', gameId => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, gameId, socket)) return
      const game: Game = games[gameId]
      // Send a report to everyone
      socket.emit('report', game.jsonReport())
    })

    // WIP
    socket.on('startGame', content => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, content.gameId, socket)) return
      const game: Game = games[content.gameId]
      // Start game
      game.start(content.time)
      // Send a report to everyone
      socket.to(content.gameId).emit('report', game.jsonReport()) // sends to other players
      socket.emit('report', game.jsonReport()) // sends to the manager
    })

    //event
    socket.on('event', (msg: ManagerEvent) => {
      console.log(`[${msg.gameId}] ${JSON.stringify(msg.event)} received, with players : ${msg.chosenPlayers}`)


      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]
      game.addToFeed(`You received an event : ${msg.event.name} with ${msg.chosenPlayers ? msg.chosenPlayers : "everyone"}`, msg.chosenPlayers)
      socket.to(msg.gameId).emit('report', game.jsonReport())
      socket.emit('report', game.jsonReport())
      // Send a report to everyone
      socket.to(msg.gameId).emit('event', msg) // sends to other players
    })

    //buzz
    socket.on('chargeFail', (msg: ClientMessage) => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]
      game.addToFeed(`${msg.content[0]} is not in a relationship with ${msg.content[1]}`)
      socket.to(msg.gameId).emit('report', game.jsonReport())
      socket.emit('report', game.jsonReport())
      socket.to(msg.gameId).emit('chargeFail', msg.content) // sends to other players
    })

    socket.on('chargeSucceed', (msg: ClientMessage) => {
      //TODO add score counter if people found the right link
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]
      const player = game.findPlayer(msg.emitter);
      if(player) {
        player.score += 10 + game.diffTime()
        if(player.next == msg.content[0]) {
          player.nextFound = true
        }
        else {
          player.previousFound = true
        }
      } 
      game.addToFeed(`Someone found that ${msg.content[0]} and ${msg.content[1]} are in a relationship`, [msg.content[0], msg.content[1]])
      game.addToFeed(`You (${msg.emitter}) found that ${msg.content[0]} is cheating on you with ${msg.content[1]}`, [msg.emitter])
      socket.to(msg.gameId).emit('report', game.jsonReport())
      socket.emit('report', game.jsonReport())
    })

    //Mini-game Treachery/Trust handler, manager announces the winner
    socket.on('treachTrust', (msg: ClientMessage) => {
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]
      game.addToFeed(`You (${msg.emitter}) have voted ${msg.content}`, [msg.emitter])
      socket.to(msg.gameId).emit('report', game.jsonReport())
      socket.emit('report', game.jsonReport())
    })

    socket.on('rewardpenalty', (msg: RewardPenalty) => {
      if (!checkExists(games, msg.gameId, socket)) return
      const game: Game = games[msg.gameId]

      switch (msg.content) {
        case 'Clue':
          var player = game.findPlayer(msg.target)
          if (player != null) {
            var traitToSend = player.traits[Math.floor(Math.random() * 5)]
            game.addToFeed(`You (${msg.receiver}) received a clue about ${msg.target} : ${traitToSend}`, [msg.receiver])
            game.addToFeed(`${msg.receiver} received a clue about you (${msg.target})`, [msg.target])
          }
          break;
        case 'Question':
          game.addToFeed(`You (${msg.receiver}) received a reward : ask ONE question to ${msg.target}, they are forced to tell the truth`, [msg.receiver])
          game.addToFeed(`You (${msg.target}) received a penalty : you must answer ONE question from ${msg.receiver} without lying`, [msg.target])
          break;
        case 'Lose attempt':
          game.addToFeed(`You (${msg.receiver}) received a penalty : you've lost one attempt at charging someone`, [msg.receiver])
          break;
        case 'Reveal information':
          var player = game.findPlayer(msg.receiver)
          if (player != null) {
            var traitToSend = player.traits[Math.floor(Math.random() * 5)]
            game.addToFeed(`${msg.receiver} received a penalty, you all learn one of their traits : ${traitToSend}`)
          }
          break;
          case 'Win attempt':
            game.addToFeed(`You (${msg.receiver}) received a reward : you get one more attempt at charging someone`, [msg.receiver])
            break;
      }
      socket.to(msg.gameId).emit('rewardpenalty', msg)
      socket.to(msg.gameId).emit('report', game.jsonReport())
      socket.emit('report', game.jsonReport())
    })
  })

  return io
}