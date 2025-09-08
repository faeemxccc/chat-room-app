const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


// Serve home.html as the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

// Serve other static files (css, js, etc.)
app.use(express.static(path.join(__dirname, 'src/views')));

let onlineCount = 0;

io.on('connection', (socket) => {
    onlineCount++;
    io.emit('online count', onlineCount);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        onlineCount = Math.max(onlineCount - 1, 0);
        io.emit('online count', onlineCount);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});