async function sendMessage() {
  const input = document.getElementById('userInput');
  const chat = document.getElementById('chat');
  const userText = input.value;
  chat.innerHTML += `<div><strong>You:</strong> ${userText}</div>`;
  input.value = '';

  const response = await fetch('https://wab-ai.onrender.com/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userText })
  });
  
  const data = await response.json();
  chat.innerHTML += `<div><strong>WAB AI:</strong> ${data.reply}</div>`;
  chat.scrollTop = chat.scrollHeight;
}
