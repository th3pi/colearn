const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const cors = require('cors');
const path = require('path');

const sqlRoutes = require('../routes/sql_routes')

app.use(cors());

app.use(require('express').json());
app.use(require('express').urlencoded({ extended: false }));
app.use(require('express').static(path.join(__dirname, 'public')));

app.use('/sql', sqlRoutes);

/**
 * app.listen(8282) has been deprecated since socket.io and express is 
 * sharing the same port now
 */
// app.listen(8282);

/**
 * Backend run checker
 * Send get request to http://localhost:8282/
 * returns HELLO WORLD!
 */
app.get('', (req, res) => {
    res.send("HELLO WORLD!");
})

server.listen(4113, () => {
    console.log('Listening on port *: 4113');

})

io.on('connect', (socket) => {
    socket.on('test', (data) => {
        console.log(data);
    })
    socket.on("sqlTyping", (data) => {
        console.log("User is typing");
        io.emit("sqlTyping", data);
    })
    socket.on("typing", (data) => {
        console.log("User is typing");
        io.emit("typing", data);
    })
    socket.on('send', data => {
        console.log("Received send");

        io.emit('results', data);
        socket.emit('results', data);
    })
    socket.on('disconnect', () => {
        console.log("DISCONNECTED");

    })
})

module.exports = app;