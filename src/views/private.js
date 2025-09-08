// private.js
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const onlineCountSpan = document.getElementById('online-count');
const chatContainer = document.getElementById('chat-container');
const msgSound = document.getElementById('msg-sound');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const themeBtn = document.getElementById('theme-btn');
const chatHeaderTitle = document.getElementById('chat-header-title');
const copyHeaderCodeBtn = document.getElementById('copy-header-code-btn');

const privatePopup = document.getElementById('private-popup');
const privateRoomCodeInput = document.getElementById('private-room-code');
const copyCodeBtn = document.getElementById('copy-code-btn');
const closePopupBtn = document.getElementById('close-popup-btn');

let currentUser = localStorage.getItem('lastUser') || '';
let selectedAvatar = localStorage.getItem('profilePic') || '1';
let currentRoom = '';

function getAvatarUrl() {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAvatar}`;
}

function appendMessage({ user, text, avatar }) {
    const div = document.createElement('div');
    div.className = `message ${user === currentUser ? 'sent' : 'received'}`;
    div.innerHTML = `
        <img class="avatar" src="${avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=1'}" alt="avatar">
        <div class="bubble-inner">
            <div class="username">${user === currentUser ? 'You' : user}</div>
            <div class="text" style="margin-top:0.18rem;line-height:1.6;font-size:1.04rem;word-break:break-word;">${text}</div>
        </div>
    `;
    // Add a subtle gradient border for sent messages
    if (user === currentUser) {
        div.querySelector('.bubble-inner').style.boxShadow = '0 2px 12px rgba(124,93,250,0.10)';
        div.querySelector('.bubble-inner').style.border = '1.5px solid #a18fff33';
    } else {
        div.querySelector('.bubble-inner').style.border = '1.5px solid #e0e0e0';
    }
    messages.appendChild(div);
    const shouldScroll = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 100;
    if (shouldScroll) {
        div.style.opacity = '0';
        div.style.transform = 'translateY(20px)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
            messages.scrollTop = messages.scrollHeight;
        }, 50);
    }
}

function loadPrivateChat() {
    if (currentRoom) {
        messages.innerHTML = '';
        let room = JSON.parse(localStorage.getItem(`chatroom_${currentRoom}`) || '{"messages":[]}');
        room.messages.forEach(msg => appendMessage(msg));
    }
}

function sendMessage() {
    const text = messageInput.value.trim().substring(0, 200);
    if (!text) return;
    if (currentRoom) {
        let room = JSON.parse(localStorage.getItem(`chatroom_${currentRoom}`) || '{"messages":[]}');
        room.messages.push({ user: currentUser, text, avatar: getAvatarUrl() });
        localStorage.setItem(`chatroom_${currentRoom}`, JSON.stringify(room));
        appendMessage({ user: currentUser, text, avatar: getAvatarUrl() });
    }
    messageInput.value = '';
    messageInput.focus();
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

muteBtn.onclick = () => {
    bgMusic.muted = !bgMusic.muted;
    msgSound.muted = !msgSound.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇" : "🔊";
};

function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('darkMode', dark);
}
let isDarkMode = localStorage.getItem('darkMode') === 'true';
setTheme(isDarkMode);
themeBtn.onclick = () => setTheme(!isDarkMode);

document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
chatContainer.style.opacity = '0';
chatContainer.style.transition = 'opacity 0.3s ease';

// --- Room code logic ---
function showPopupWithCode(code) {
    privateRoomCodeInput.value = code;
    privatePopup.style.display = 'flex';
}

copyCodeBtn.onclick = () => {
    privateRoomCodeInput.select();
    document.execCommand('copy');
    copyCodeBtn.textContent = 'Copied!';
    setTimeout(() => copyCodeBtn.textContent = 'Copy', 1200);
};

copyHeaderCodeBtn.onclick = () => {
    navigator.clipboard.writeText(currentRoom);
    copyHeaderCodeBtn.textContent = '✅';
    setTimeout(() => copyHeaderCodeBtn.textContent = '🔗', 1200);
};

closePopupBtn.onclick = () => {
    privatePopup.style.display = 'none';
    chatContainer.style.display = 'flex';
    setTimeout(() => {
        chatContainer.style.opacity = '1';
        messageInput.focus();
    }, 50);
};

// --- Initialization ---
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

window.onload = function() {
    let code = getQueryParam('code');
    let isCreator = getQueryParam('creator') === '1';
    if (!code) {
        // If no code, redirect to main page
        window.location.href = 'index.html';
        return;
    }
    currentRoom = code;
    chatHeaderTitle.textContent = 'Private Chat';
    if (isCreator) {
        showPopupWithCode(code);
        chatContainer.style.display = 'none';
    } else {
        chatContainer.style.display = 'flex';
        setTimeout(() => {
            chatContainer.style.opacity = '1';
            messageInput.focus();
        }, 50);
    }
    loadPrivateChat();
};
