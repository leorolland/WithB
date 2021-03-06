import { createCircle, Person } from "./generator";

type Message = {
  date: Date
  content: string
  receivers?: string[]
}

export class Game {

  id: string
  // First, players are stored in lobby
  lobby: string[]
  // When the game starts, players in the lobby are converted to players
  players: Person[]
  endedAt: Date
  started: boolean
  feed: Message[]
  ended : boolean

  constructor() {
    this.id = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.lobby = []
    this.players = []
    this.endedAt= new Date();
    this.started = false
    this.feed = []
    this.ended = false
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

  addToFeed(msg: string, receivers?: string[]) {
    this.feed.unshift({
      content: msg,
      date: new Date(),
      receivers
    })
  }

  start(time:number) {
    this.players = createCircle(this.lobby)
    this.lobby = []
    this.endedAt = new Date(new Date().getTime() + time*60000);
    this.started = true
  }

  findPlayer(name:string) {
    for (var player of this.players) {
      if (player.name==name) return player
    }
    return null
  }

  /**
   * 
   * @returns the time before the end of the game (in seconds)
   */
  diffTime() {
  let diff = Math.abs(this.endedAt.getTime() - new Date().getTime());
  return Math.floor(diff / 1000);
  }

}