const app = require('express')();
const http = require('http').createServer(app);

// Import the router from router.ts
const router = require('./router')

// Tell our app to use this router
app.use(router)

// Run server
http.listen(8080, () => { console.log('listening on *:8080') });