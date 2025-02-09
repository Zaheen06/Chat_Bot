const API_KEY = "AIzaSyCi6Ypf539cGL1MDSm4tZ5trJfQBX3douQ";
let typingStopped = false;

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("stop-btn").addEventListener("click", stopTyping);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage();
});

async function sendMessage() {
    const userMessage = document.getElementById("user-input").value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "contents": [{ "parts": [{ "text": userMessage }] }] })
        });

        const data = await response.json();
        let botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";

        botMessage = formatMessage(botMessage);

        document.getElementById("stop-btn").style.display = "inline-block";
        typingStopped = false;
        typeMessage(botMessage);
    } catch (error) {
        typeMessage("⚠️ Error: Unable to connect to AI service.");
    }
}

function addMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerHTML = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "bot");

    msgDiv.innerHTML = message;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function stopTyping() {
    typingStopped = true;
    document.getElementById("stop-btn").style.display = "none";
}

function formatMessage(text) {
    let isCode = false;

    text = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, function(match, lang, code) {
        if (lang.toLowerCase() === "c" || lang.toLowerCase() === "cpp" || lang.toLowerCase() === "arduino") {
            isCode = true;
        }
        return `<pre><code class="${lang}" onclick="copyCode(this)">${escapeHTML(code)}</code></pre>`;
    });

    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    if (isCode) {
        text += `<p style="font-size: 12px; color: #aaa;">(Tap to copy 📋)</p>`;
    }

    return text;
}

function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function copyCode(element) {
    const codeText = element.innerText;

    navigator.clipboard.writeText(codeText).then(() => {
        const oldText = element.innerText;
        element.innerText = "✅ Copied!";
        setTimeout(() => {
            element.innerText = oldText;
        }, 1500);
    }).catch(err => {
        console.error("Error copying code:", err);
    });
}

document.getElementById("copy-btn").addEventListener("click", function() {
    const chatBox = document.getElementById("chat-box");
    const textToCopy = chatBox.innerText.trim();

    if (!textToCopy) {
        alert("No chat messages to copy!");
        return;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById("copy-btn");
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy Chat"; }, 1500);
    }).catch(err => {
        console.error("Copy failed: ", err);
    });
});
