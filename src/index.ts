import { io } from "./io";

const app     = require('express')();
const http    = require('http').createServer(app);
const router  = require('./router')

// The list of currently played games. Accessible using req.app.get('games')
app.set('games', {})

// Open a socket.io instance and save it as "io" in our express app
// Then the io instance will be accessible using req.app.get('io')
app.set('io', io(http, app.get('games')))

// Tell our app to use this router
app.use(router)

// Run server
http.listen(8080, () => { console.log('listening on *:8080') });