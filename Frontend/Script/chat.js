

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

        showMsg();

        // setInterval(async () => {


        // }, 1000)


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

setInterval(() => {
    showMsg();
}, 1000)


// async function showMsg() {
//     try {
//         var chats = JSON.parse(localStorage.getItem('chatmsg'));

//         if (chats) {
//             const lsid = chats[chats.length - 1].id;

//             const res = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg/${lsid}`);
//             console.log(res,'if res');
//             chats = chats.concat(res.data);
//             console.log(chats,'if chats');
//             localStorage.setItem('chatmsg', JSON.stringify(chats));
//             var msgBox = document.getElementById('msgBox');
//             msgBox.innerHTML = '';
//             for (var i = 0; i < chats.length; i++) {
//                 console.log(chats[i].chat);
//             //     var li = document.createElement('li');
//             //     li.textContent = `${chats[i].chat}`;
//             //     msgBox.appendChild(li);
//             //     scrollToBottom();
//             }

//         } else {
//             const res = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg/0`);
//             console.log(res);
//             chats = res.data.messages;
//             console.log(chats); 
//             localStorage.setItem('chatmsg', JSON.stringify(chats));
//         }



//     } catch (err) {
//         console.log(err);
//     }
// }

async function showMsg() {
    try {

        var msgBox = document.getElementById('msgBox');
        const chat = await axios.get('http://localhost:4106/nexchat/chats/get-all-msg');
        msgBox.innerHTML = '';
        for (var i = 0; i < chat.data.messages.length; i++) {
            // console.log(chat.data.messages[i]);
            var li = document.createElement('li');
            li.textContent = `${chat.data.messages[i].chat}`;
            msgBox.appendChild(li);
            scrollToBottom();
        }
    } catch (err) {
        console.log(err);
    }
}

var logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    // window.location.href = './SignIn.html';
    window.location.href = './home.html';
})
