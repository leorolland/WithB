import { Request, Response } from "express";

const app = require('express')();
const http = require('http').createServer(app);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/join.html');
});

http.listen(8080, () => { console.log('listening on *:8080') });