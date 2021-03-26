import { Request, Response, Router } from "express";
import { Server } from "socket.io";
import { Game } from "./game";

let router = Router()

// Landing page
router.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/join.html');
});

// Game creation
router.get('/create', (req: Request, res: Response) => {
  let games: any = req.app.get('games')
  // Add a new game to the list
  let newGame = new Game()
  games[newGame.id] = newGame
  console.log('Created game : ' + newGame.id)
  console.log('Games : ', Object.keys(games))
  // Redirect the creator to the manager interface
  res.redirect(`/manager/${newGame.id}`)
})

//
router.get('/style.css', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/style.css')
})

// Game Manager
router.get('/manager/:gameId', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/manager.html')
})

// Player interface
router.get('/:gameId/:nickname', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/player.html');
})

module.exports = router