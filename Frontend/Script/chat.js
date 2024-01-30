var sendChat = document.getElementById('sendchat');

sendChat.addEventListener('click', async () => {
    try {
        var chat = document.getElementById('chat-input');
        const headers = { 'authorization': localStorage.getItem('token') };
        const chats = { chat: chat.value };
        let response = await axios.post('http://localhost:4106/nexchat/chats/send-msg', chats, { headers });
        chat.value = '';
    } catch (err) {
        console.log(err);
    }
})

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // console.log('hiiiii');
        const headers = { 'authorization': localStorage.getItem('token') };
        const user = await axios.get('http://localhost:4106/nexchat/user/getUserInfo', { headers });
        // console.log(user);
        displayUserInformation(user.data)
        fetchMsg();
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
    chatContainer[0].scrollTop = chatContainer[0].scrollHeight;
}

async function fetchMsg() {
    try {

        const headers = { 'authorization': localStorage.getItem('token') };

        // const users = await axios.get('http://localhost:4106/nexchat/user/get-all-user', { headers });

        let messages = JSON.parse(localStorage.getItem('msg'));

        if (messages) {
            const last = 0;
            // console.log(last);
            const chat = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg?last=${last}`);
            const msg = localStorage.setItem('msg', JSON.stringify(chat.data.messages));
            showMsg(messages);

        } else {
            last = messages[messages.length - 1].id;
            const chat = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg?last=${last}`);
            const msg = localStorage.setItem('msg', JSON.stringify(chat.data.messages));
            showMsg(messages);
            // console.log(chat);
            // console.log(last);
        }
        // console.log(last, 'id of last masg in local storage');


    } catch (err) {
        console.log(err);
    }
}

// setInterval(() => {
//     fetchMsg();
// }, 1000)


function showMsg(messages) {
    try {

        // let message = JSON.parse(localStorage.getItem('msg'));
        // console.log(messages);
        // console.log(user);
        var masgBox = document.getElementById('msgBox');
        masgBox.innerHTML = ''

        for (let i = 0; i < messages.length; i++) {


            const div = document.createElement('div');
            div.textContent = `${messages[i].chat}`;
            div.classList = 'msgs-div';
            masgBox.appendChild(div);
            scrollToBottom();
        }


    } catch (err) {
        console.log(err);
    }
}

var logout = document.getElementById('logout');

logout.addEventListener('click', () => {

    localStorage.removeItem('token');
    window.location.href = './home.html';

})
