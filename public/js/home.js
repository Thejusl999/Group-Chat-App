document.addEventListener("DOMContentLoaded", function () {
    const groupLi=document.getElementById('groupLi');
    const chatIcon=document.getElementById('chatIcon');

    const defaultDisplay=document.querySelector('.default-screen');
    const chatHeader = document.getElementById('chatHeader');
    const messagesList = document.getElementById('messages');
    const messagesDiv = document.getElementById('messagesDiv');
    const messageInp=document.querySelector('.message-input');

    groupLi.addEventListener("click", function (event) {
        showMessages(event.target.textContent);
    });

    chatIcon.addEventListener("click", function (event) {
        showDefault();
    });

    function showMessages(groupOrPerson) {
      messagesDiv.style.display='block';
      messagesList.innerHTML = '';
      defaultDisplay.style.display='none';
      messageInp.style.display='flex';

      const exampleMessages = {
        'Vaibhav': [
          {author: 'You', text: 'joined'},
          {author: 'Vaibhav', text: 'joined'},
          {author: 'Vaibhav', text: 'hello'},
          {author: 'You', text: 'hi There'},
          {author: 'Vaibhav', text: 'Whats up?'},
          {author: 'You', text: 'All good'},
        ],
      };

      const messages = exampleMessages[groupOrPerson] || [];
      chatHeader.textContent = groupOrPerson.replace(/(\d+)/g, ' $1');
      messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<div class=${message.author}><span class="author">${message.author}:</span> <span class="text">${message.text}</span></div>`;
        messagesList.appendChild(messageDiv);
      });
    }

    function showDefault(e){
      defaultDisplay.style.display='flex';
      messagesDiv.style.display='none';
      messageInp.style.display='none';
    }
})