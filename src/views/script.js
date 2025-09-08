const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const onlineCountSpan = document.getElementById('online-count');
const loginPopup = document.getElementById('login-popup');
const loginUsername = document.getElementById('login-username');
const loginBtn = document.getElementById('login-btn');
const chatContainer = document.getElementById('chat-container');
const msgSound = document.getElementById('msg-sound');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const themeBtn = document.getElementById('theme-btn');

// Profile & Private Chat UI
const avatarPics = document.querySelectorAll('.avatar-pic');
let selectedAvatar = localStorage.getItem('profilePic') || '1';
const createPrivateBtn = document.getElementById('create-private-btn');
const joinCodeInput = document.getElementById('join-code-input');
const joinPrivateBtn = document.getElementById('join-private-btn');

let currentUser = '';
let isMuted = false;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Message handling
function appendMessage({ user, text, avatar }) {
    const div = document.createElement('div');
    div.className = `message ${user === currentUser ? 'sent' : 'received'}`;
    div.innerHTML = `
        <div class="username">
            <img src="${avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=1'}" width="24" height="24" style="border-radius:50%;vertical-align:middle;margin-right:6px;">${user === currentUser ? 'You' : user}
        </div>
        <div class="text">${text}</div>
    `;
    messages.appendChild(div);
    
    // Smooth scroll to bottom
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

// Avatar selection logic
avatarPics.forEach(img => {
    if (img.dataset.avatar === selectedAvatar) img.style.border = '2px solid #7C5DFA';
    img.addEventListener('click', () => {
        avatarPics.forEach(i => i.style.border = '2px solid #ccc');
        img.style.border = '2px solid #7C5DFA';
        selectedAvatar = img.dataset.avatar;
        localStorage.setItem('profilePic', selectedAvatar);
    });
});

function getAvatarUrl() {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAvatar}`;
}

// Private chat code generation
function generateCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

createPrivateBtn.onclick = () => {
    const code = generateCode();
    // Save empty chat room in localStorage (simulate room creation)
    localStorage.setItem(`chatroom_${code}`, JSON.stringify({ messages: [] }));
    // Save user for private chat
    localStorage.setItem('lastUser', loginUsername.value.trim().substring(0, 16) || "Guest");
    window.location.href = `private.html?code=${code}&creator=1`;
};

joinPrivateBtn.onclick = () => {
    const code = joinCodeInput.value.trim().toUpperCase();
    if (!code) return alert('Enter a code!');
    if (localStorage.getItem(`chatroom_${code}`)) {
        localStorage.setItem('lastUser', loginUsername.value.trim().substring(0, 16) || "Guest");
        window.location.href = `private.html?code=${code}`;
    } else {
        alert('Chat not found!');
    }
};

// Login handling
loginBtn.onclick = () => {
    const user = loginUsername.value.trim().substring(0, 16) || "Guest";
    currentUser = user;
    localStorage.setItem('profilePic', selectedAvatar);
    loginPopup.style.opacity = '0';
    setTimeout(() => {
        loginPopup.style.display = 'none';
        chatContainer.style.display = 'flex';
        setTimeout(() => {
            chatContainer.style.opacity = '1';
            messageInput.focus();
        }, 50);
    }, 300);
    // Start music with lower volume
    bgMusic.volume = 0.15;
    bgMusic.play().catch(() => {});
    // Show avatar in chat header (optional)
    let header = document.querySelector('.app-header .header-content');
    if (header && !header.querySelector('.profile-avatar')) {
        let img = document.createElement('img');
        img.src = getAvatarUrl();
        img.width = 32;
        img.height = 32;
        img.className = 'profile-avatar';
        img.style = 'border-radius:50%;margin-left:12px;vertical-align:middle;border:2px solid #7C5DFA;';
        header.appendChild(img);
    } else if (header) {
        header.querySelector('.profile-avatar').src = getAvatarUrl();
    }
};

// Message sending
function sendMessage() {
    const text = messageInput.value.trim().substring(0, 200);
    if (!text) return;
    socket.emit('chat message', { user: currentUser, text, avatar: getAvatarUrl() });
    messageInput.value = '';
    messageInput.focus();
}

sendBtn.onclick = sendMessage;

// Event listeners
loginUsername.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Socket events
socket.on('chat message', (msg) => {
    appendMessage(msg);
    if (msg.user !== currentUser) {
        msgSound.currentTime = 0;
        msgSound.play().catch(() => {});
    }
});

socket.on('online count', (count) => {
    onlineCountSpan.textContent = count;
});

muteBtn.onclick = () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    msgSound.muted = isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
};

// Theme handling
function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('darkMode', dark);
    isDarkMode = dark;
}

// Initialize theme
setTheme(isDarkMode);

// Theme toggle
themeBtn.onclick = () => {
    setTheme(!isDarkMode);
};

// Add smooth transitions
document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
chatContainer.style.opacity = '0';
chatContainer.style.transition = 'opacity 0.3s ease';
loginPopup.style.transition = 'opacity 0.3s ease';

// Show animations
loginPopup.style.opacity = '1';
loginBtn.onclick = () => {
    const user = loginUsername.value.trim().substring(0, 16) || "Guest";
    currentUser = user;
    loginPopup.style.opacity = '0';
    setTimeout(() => {
        loginPopup.style.display = 'none';
        chatContainer.style.display = 'flex';
        setTimeout(() => {
            chatContainer.style.opacity = '1';
            messageInput.focus();
        }, 50);
    }, 300);
    
    // Start music with lower volume
    bgMusic.volume = 0.15;
    bgMusic.play().catch(() => {});
};