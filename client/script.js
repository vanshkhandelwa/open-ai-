import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form'); // Added to ensure form is defined
const chatContainer = document.querySelector('#chat_container');
let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueID() {
  const timestamp = Date.now();
  const randomnum = Math.random();
  const hexadec = randomnum.toString(16);

  return `id-${timestamp}-${hexadec}`;
}

function chatStrip(isAi, value, uniqueId) {
  return `
      <div class="wrapper ${isAi ? 'ai' : ''}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form); // Corrected FromData to FormData

  const userInput = data.get('prompt');
  chatContainer.innerHTML += chatStrip(false, userInput);

  form.reset();
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStrip(true, ' ', uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);
  loader(messageDiv);

  try {
    const response = await fetch('https://openai-ijjm.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userInput,
      }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = 'Something went wrong';
      alert(err);
    }
  } catch (error) {
    console.error(error);
    messageDiv.innerHTML = 'Something went wrong';
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
