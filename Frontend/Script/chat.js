

var sendChat = document.getElementById('sendchat');

sendChat.addEventListener('click', async () => {
    try {
        var chat = document.getElementById('chat-input');
        const headers = { 'authorization': localStorage.getItem('token') };
        const chats = { chat: chat.value };
        let response = await axios.post('http://localhost:4106/nexchat/chats/send-msg', chats, { headers });
        showMsg(response.data.chat)
        // console.log(response);

        chat.value = '';

    } catch (err) {
        console.log(err);
    }


})



window.addEventListener('DOMContentLoaded', async () => {
    try {

        const headers = { 'authorization': localStorage.getItem('token') };



        const chat = await axios.get('http://localhost:4106/nexchat/chats/get-msg', { headers });
        for (var i = 0; i < chat.data.length; i++) {
            // console.log(chat.data[i].chat);
            showMsg(chat.data[i]);
        }


    } catch (err) {
        console.log(err);
    }
})

function showMsg(chat) {
    var msgBox = document.getElementById('msgBox');

    var li = document.createElement('li');
    li.textContent = `${chat.chat}`;
    msgBox.appendChild(li);
}
