import { createCircle, Person } from "./generator";

export class Game {

  id: string
  // First, players are stored in lobby
  lobby: string[]
  // When the game starts, players in the lobby are converted to players
  players: Person[]
  createdAt: Date
  started: boolean

  constructor() {
    this.id = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.lobby = []
    this.players = []
    this.createdAt = new Date()
    this.started = false
  }

  addToLobby(nickname: string) {
    if (!this.isNicknameTaken(nickname)) this.lobby.push(nickname)
  }

  jsonReport() {
    return JSON.stringify(this)
  }

  isNicknameTaken(name: string) {
    return [...this.lobby, ...this.players].includes(name)
  }

  start() {
    this.players = createCircle(this.lobby)
    this.lobby = []
    this.started = true
  }

}