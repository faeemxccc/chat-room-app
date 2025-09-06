class User {
    constructor(username) {
        this.username = username;
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }
}

export default User;