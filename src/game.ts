import { Person } from "./generator";

export class Game {

  id: string
  players: Person[]
  createdAt: Date

  constructor() {
    this.id = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.players = []
    this.createdAt = new Date()
  }

}