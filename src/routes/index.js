function setRoutes(app) {
    const chatRoom = require('../chat/chatRoom');
    const User = require('../users/user');

    const chatInstance = new chatRoom.ChatRoom();
    
    app.get('/chat', (req, res) => {
        res.sendFile('index.html', { root: './src/views' });
    });

    app.post('/chat/message', (req, res) => {
        const { username, message } = req.body;
        const user = new User(username);
        chatInstance.addMessage(user, message);
        res.status(200).send({ success: true });
    });

    app.get('/chat/messages', (req, res) => {
        const messages = chatInstance.getMessages();
        res.status(200).send(messages);
    });
}

module.exports = setRoutes;