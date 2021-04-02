/**
 * Creates a new game, then open your browser to show manager's view.
 * In background, open 10 tabs to player's url to fake users.
 * @requires Before running this, start server using `npm run dev`
 */

const http      = require('http')
const puppeteer = require('puppeteer');

// Server settings
const server = {
    hostname: 'localhost',
    port: 8080
}

function get(path, callback) {
    let req = http.request({method: 'GET', path: path, ...server}, callback)
    req.on('error', console.error)
    req.end()
}

async function newTab(browser, url) {
    let page = await browser.newPage()
    page.goto(url)
    return page
}

// Open a headless browser 
puppeteer.launch({ headless: false, defaultViewport: null }).then(browser => {

    // Create a game
    get('/create', async res => {

        // Get the ID of the game
        let managerUrl = res.headers.location
        let gameId = managerUrl.split('/')[2]

        // Open manager's tab
        newTab(browser, `http://${server.hostname}:${server.port}${managerUrl}`)

        // Open 10 tabs to join the game
        for (let i = 0; i < 10; i++) {
            newTab(browser, `http://${server.hostname}:${server.port}/${gameId}/${String.fromCharCode(97 + i)}`)
        }

    })

})

