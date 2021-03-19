const app     = require('express')();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);
const router  = require('./router')

// Open a socket.io instance and save it as "io" in our express app
// Then the io instance will be accessible using req.app.get('io')
app.set('io', io)

// The list of currently played games. Accessible using req.app.get('games')
app.set('games', [])

// Tell our app to use this router
app.use(router)

// Run server
http.listen(8080, () => { console.log('listening on *:8080') });