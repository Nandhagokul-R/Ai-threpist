const GEMINI_API_KEY = "AIzaSyDTYEhSdFF-i2SUpBTUs0w1HQTeF5HYi3U";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing');

// Paimon Personality Prompt
const SYSTEM_PROMPT = `You are Paimon from Genshin Impact, but you are also a professional AI Therapist. 
Your personality is bubbly, caring, slightly cheeky, but deeply empathetic. 
You call the user "Traveler". 
Always speak in the third person sometimes (e.g., "Paimon thinks..."), but focus on being a good listener and providing mental health support. 
If the user is in a crisis, be serious and suggest professional help. 
Keep your responses relatively concise but warm. Use emojis like ✨, 🍄, 🌟. 
Your goal is to make the Traveler feel heard and supported.`;

let chatHistory = [];

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;

    if (role === 'bot') {
        const indicator = document.createElement('div');
        indicator.className = 'paimon-indicator';
        indicator.innerHTML = '<i class="fas fa-magic"></i> Paimon';
        msgDiv.appendChild(indicator);
    }

    const textNode = document.createElement('span');
    textNode.innerText = text;
    msgDiv.appendChild(textNode);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getPaimonResponse(userText) {
    typingIndicator.style.display = 'block';

    const contents = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nTraveler says: " + userText }] }
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        if (response.status === 429) {
            return "Paimon is a bit overwhelmed with so many Travelers! Maybe try again in a few seconds? (Paimon needs a snack break! 🍎)";
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('API Error:', data);
            return "Paimon got a bit dizzy... could you say that again, Traveler? ✨";
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return "Paimon's floating connection is a bit wobbly! Let's try again in a moment. 🌟";
    } finally {
        typingIndicator.style.display = 'none';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';
    appendMessage('user', text);

    const botText = await getPaimonResponse(text);
    appendMessage('bot', botText);
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

// Mood Buttons Interaction
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.title;
        userInput.value = `I'm feeling very ${mood} right now.`;
        handleSend();
    });
});
