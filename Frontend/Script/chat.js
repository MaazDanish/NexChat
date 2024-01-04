var sendChat = document.getElementById('sendchat');

sendChat.addEventListener('click', () => {
    var chat = document.getElementById('chat-input');
    const chats = {
        chat: chat.value
    }
    console.log(chats);
})

