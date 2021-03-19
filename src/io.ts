import { maxHeaderSize } from "http";
import { Server, Socket } from "socket.io";
import { Game } from "./game";

export type ClientMessage = {
  gameId: string,
  content: any
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
      // Send the report
      socket.emit('report', game.jsonReport())
    })

    // WIP
    socket.on('startGame', gameId => {
      // Get the corresponding game if it exists, else leave
      if (!checkExists(games, gameId, socket)) return
      const game: Game = games[gameId]
      game.start()
    })

  })

  return io
}