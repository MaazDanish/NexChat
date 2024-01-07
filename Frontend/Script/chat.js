

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

        const user = await axios.get('http://localhost:4106/nexchat/user/getUserInfo', { headers });
        // console.log(user);
        displayUserInformation(user.data)

        const chat = await axios.get('http://localhost:4106/nexchat/chats/get-all-msg', { headers });
        for (var i = 0; i < chat.data.messages.length; i++) {
            console.log(chat.data.messages[i]);
            showMsg(chat.data.messages[i]);
        }


    } catch (err) {
        console.log(err);
    }
})

function displayUserInformation(user) {
    document.getElementById('userInfo').innerHTML = `
    <p class="text-color"><h5>Name</h5> ${user.name}  </p>
    <p class="text-color"><h5>Email</h5> ${user.email}</p>
    <p class="text-color"><h5>Phone Number</h5> ${user.phoneNumber}</p>
    `
}

function scrollToBottom() {
    var chatContainer = document.getElementsByClassName("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


function showMsg(chat) {
    var msgBox = document.getElementById('msgBox');

    var li = document.createElement('li');
    li.textContent = `${chat.chat}`;
    msgBox.appendChild(li);
    scrollToBottom();
}

var logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    // window.location.href = './SignIn.html';
    window.location.href = './home.html';
})
