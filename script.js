const API_KEY = "AIzaSyCi6Ypf539cGL1MDSm4tZ5trJfQBX3douQ";  

        document.getElementById("send-btn").addEventListener("click", sendMessage);
        document.getElementById("user-input").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
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
                const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";

                typeMessage(botMessage);
            } catch (error) {
                typeMessage("⚠️ Error: Unable to connect to AI service.");
            }
        }

        function addMessage(message, sender) {
            const chatBox = document.getElementById("chat-box");
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", sender);
            msgDiv.innerText = message;
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight; 
        }

        function typeMessage(message) {
            const chatBox = document.getElementById("chat-box");
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", "bot");
            chatBox.appendChild(msgDiv);
            let index = 0;

            function typeNextLetter() {
                if (index < message.length) {
                    msgDiv.innerHTML += message.charAt(index);
                    index++;
                    chatBox.scrollTop = chatBox.scrollHeight;
                    setTimeout(typeNextLetter, -5);  
                }
            }

            typeNextLetter();
        }