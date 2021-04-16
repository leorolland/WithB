import { createCircle, Person } from "./generator";

type Message = {
  date: Date
  content: string
}

export class Game {

  id: string
  // First, players are stored in lobby
  lobby: string[]
  // When the game starts, players in the lobby are converted to players
  players: Person[]
  createdAt: Date
  started: boolean
  feed: Message[]

  constructor() {
    this.id = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.lobby = []
    this.players = []
    this.createdAt = new Date()
    this.started = false
    this.feed = []
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

  addToFeed(msg: string) {
    this.feed.push({
      content: msg,
      date: new Date()
    })
  }

  start() {
    this.players = createCircle(this.lobby)
    this.lobby = []
    this.started = true
  }

}