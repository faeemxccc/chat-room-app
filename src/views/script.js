const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const onlineCountSpan = document.getElementById('online-count');

// Login popup elements
const loginPopup = document.getElementById('login-popup');
const loginUsername = document.getElementById('login-username');
const loginBtn = document.getElementById('login-btn');
const chatContainer = document.getElementById('chat-container');

const msgSound = document.getElementById('msg-sound');
const bgMusic = document.getElementById('bg-music');

let currentUser = '';

function appendMessage({ user, text }) {
    const div = document.createElement('div');
    div.innerHTML = `<span class="user">${user}:</span> <span>${text}</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Handle login
loginBtn.onclick = () => {
    const user = loginUsername.value.trim().substring(0, 16) || "Guest";
    currentUser = user;
    loginPopup.style.display = 'none';
    chatContainer.style.display = 'flex';
    messageInput.focus();
    // Start music (user interaction required for autoplay)
    bgMusic.volume = 0.25;
    bgMusic.play().catch(() => {});
};

loginUsername.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

// Send message
sendBtn.onclick = () => {
    const text = messageInput.value.trim().substring(0, 200);
    if (!text) return;
    socket.emit('chat message', { user: currentUser, text });
    messageInput.value = '';
    messageInput.focus();
};

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

socket.on('chat message', (msg) => {
    appendMessage(msg);
    // Play sound for incoming messages (except your own)
    if (msg.user !== currentUser) {
        msgSound.currentTime = 0;
        msgSound.play().catch(() => {});
    }
});
socket.on('online count', (count) => {
    onlineCountSpan.textContent = count;
});

const muteBtn = document.getElementById('mute-btn');
let isMuted = false;
muteBtn.onclick = () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
};