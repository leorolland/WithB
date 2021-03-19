import { Request, Response, Router } from "express";

let router = Router()

// Landing page
router.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/join.html');
});

// Game creation
router.get('/create', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/player.html');
})

// Game manager
router.get('/:gameId/:nickname', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/player.html');
})

// Player interface

module.exports = router