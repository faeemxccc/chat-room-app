class ChatRoom {
    constructor() {
        this.messages = [];
    }

    addMessage(username, message) {
        const timestamp = new Date().toISOString();
        this.messages.push({ username, message, timestamp });
    }

    getMessages() {
        return this.messages;
    }
}

export default ChatRoom;