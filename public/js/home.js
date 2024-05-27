document.addEventListener("DOMContentLoaded", function () {
  var initial=0;
  const groupLi=document.getElementById('groupLi');
  const chatIcon=document.getElementById('chatIcon');
  
  const defaultDisplay=document.querySelector('.default-screen');
  const chatHeader = document.getElementById('chatHeader');
  const messagesList = document.getElementById('messages');
  const messagesDiv = document.getElementById('messagesDiv');
  const messageInp=document.querySelector('.message-input');
  const message=document.getElementById('message');
  const sendMsgBtn=document.getElementById('sendMsgBtn');

  groupLi.addEventListener("click", function (event) {
    showMessages(event.target.textContent);
  });

  chatIcon.addEventListener("click", function (event) {
    showDefault();
  });

  sendMsgBtn.addEventListener("click",async function(event){
    let text=message.value;
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `<div class="You"><span class="author">You:</span> <span class="text">${text}</span></div>`;
    messagesDiv.appendChild(messageDiv);
    const response=await axios.post(
      "http://localhost:3000/home/sendMessage",
      {messageContent:text},
      {
        headers: { "Authorization": localStorage.getItem('token') },
      }
    );
    console.log(response.data.message);
    message.value = '';
    messagesList.scrollTop = messagesDiv.scrollHeight;
  });

  function showMessages(groupOrPerson) {
    messagesDiv.style.display='flex';
    messagesList.innerHTML = '';
    defaultDisplay.style.display='none';
    messageInp.style.display='flex';

    const messages = [];
    chatHeader.textContent = groupOrPerson;
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

  document.addEventListener("DOMContentLoaded",screenReload(event));
  async function screenReload(){
    const response=await axios.get(
      "http://localhost:3000/home/getMessages",
      {
        headers: { "Authorization": localStorage.getItem('token') },
      }
    );
    messagesList.innerHTML='';
    const myUserId=Number(localStorage.getItem('id'));
    response.data.messages.forEach(message => {      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      let author=message.userId===myUserId?'You':`user${message.userId}`;
      messageDiv.innerHTML = `<div class=${author}><span class="author">${author}:</span> <span class="text">${message.messageContent}</span></div>`;
      messagesList.appendChild(messageDiv);
    });
    if(initial===0&&messagesDiv.style.display!=='none'){
      messagesList.scrollTop = messagesDiv.scrollHeight;
      initial++;
    }
  }
  
  if(localStorage.getItem('token')!==null){
    setInterval(()=>screenReload(),1000);
  }
});