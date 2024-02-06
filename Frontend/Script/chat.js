var sendChat = document.getElementById('sendchat');
// const currentGroup = null;

sendChat.addEventListener('click', async () => {
    try {
        var chat = document.getElementById('chat-input');
        const headers = { 'authorization': localStorage.getItem('token') };
        const groupId = localStorage.getItem('groupId');

        const chats = {
            chat: chat.value,
            groupId: groupId
        };
        let response = await axios.post('http://localhost:4106/nexchat/chats/send-group-msg', chats, { headers });
        chat.value = '';
    } catch (err) {
        console.log(err);
    }
})


async function createGroup() {
    try {

        var notification = document.getElementById('notification');
        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        var selectUser = document.getElementById('selectUser');
        const selectedUsers = Array.from(selectUser.selectedOptions).map(option => option.value);
        console.log(selectedUsers);


        var groupName = document.getElementById('groupName').value;
        const grpBody = {
            name: groupName,
            users: selectedUsers
        }


        if (grpBody.name === '') {
            notification.className = 'notification-style';
            notification.textContent = `Group name can't be empty`;
        } else {

            const grp = await axios.post('http://localhost:4106/nexchat/group/create-group', grpBody, { headers })
            if (grp.status === 200) {
                notification.className = 'notification-style';
                notification.textContent = `${grp.data.name} is created successfully.`;
                // displayGroupList(grp.data);
            }

            document.getElementById('groupName').value = '';
        }
    } catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // console.log('hiiiii');
        const headers = { 'authorization': localStorage.getItem('token') };
        const user = await axios.get('http://localhost:4106/nexchat/user/getUserInfo', { headers });
        displayUserInformation(user.data)
        // fetchMsg();

        const grp = await axios.get('http://localhost:4106/nexchat/group/get-groups', { headers });
        displayGroupList(grp.data);
        // console.log(grp.data);

        const users = await axios.get('http://localhost:4106/nexchat/user/get-all-user', { headers });
        // console.log(users.data);
        saveUserForaddingInGroup(users.data);

        const groupId = "0c942811-9f99-4c00-bdbf-dee32d0f5496";

        // console.log(groupId);
        const usersInAGroup = await axios.get('http://localhost:4106/nexchat/group/get-all-group-users', {
            params: {
                groupId: groupId
            }
        });
        // displayGroupDetails(usersInAGroup.data, grp)
        // console.log(usersInAGroup.data[0].users);
    } catch (err) {
        console.log(err);
    }
})

function saveUserForaddingInGroup(user) {
    var selectUser = document.getElementById('selectUser');

    // console.log(user.users);

    for (var i = 0; i < user.users.length; i++) {
        // console.log(user.users[i].name, user.users[i].id);
        var option = document.createElement('option');
        option.value = user.users[i].id;
        option.text = user.users[i].name;
        selectUser.appendChild(option);
    }


}

function displayUserInformation(user) {
    document.getElementById('userInfo').innerHTML = `
    <p class="text-color"><h5>Name</h5> ${user.name}  </p>
    <p class="text-color"><h5>Email</h5> ${user.email}</p>
    <p class="text-color"><h5>Phone Number</h5> ${user.phoneNumber}</p>
    `
}

async function displayGroupDetails(groupId, groupName) {
    try {

        var groupDetailsModalLabel = document.getElementById('groupDetailsModalLabel');
        var usersInfo = document.getElementById('usersInfo');

        const usersInAGroup = await axios.get('http://localhost:4106/nexchat/group/get-all-group-users', {
            params: {
                groupId: groupId
            }
        });
        const users = usersInAGroup.data[0].users;
        usersInfo.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            usersInfo.appendChild(li);
        });
        // console.log(usersInAGroup.data[0]);
        // console.log(groupName);
        groupDetailsModalLabel.textContent = groupName;
    } catch (err) {
        console.log(err);
    }

}

function displayGroupList(grp) {
    const parent = document.getElementById('groupList');
    parent.innerHTML = '';
    for (var i = 0; i < grp.length; i++) {
        // console.log(grp[i].id);
        const li = document.createElement('li');
        li.setAttribute('group-id', grp[i].id);
        li.textContent = `${grp[i].name}`;
        const currentGroup = grp[i];
        li.onclick = function () {
            // console.log(currentGroup.id);
            // console.log(li.getAttribute('group-id'));
            // setInterval(() => {
    
            // }, 1000)
            fetchMsg(currentGroup.id, currentGroup.name)
            displayGroupDetails(currentGroup.id, currentGroup.name);
        }
        parent.appendChild(li);
    }

}


function scrollToBottom() {
    var chatContainer = document.getElementsByClassName("chatContainer");
    chatContainer[0].scrollTop = chatContainer[0].scrollHeight;
}

async function fetchMsg(grpId, groupName) {
    try {

        localStorage.setItem('groupId', grpId);

        const headers = { 'authorization': localStorage.getItem('token') };
        var msgBox = document.getElementById('msgBox');

        var grpname = document.getElementById('grp-name');



        grpname.textContent = groupName;

        const groupMessages = await axios.get('http://localhost:4106/nexchat/chats/get-group-msg', { params: { groupId: grpId } })

        msgBox.innerHTML = ''

        for (var i = 0; i < groupMessages.data.message.length; i++) {
            // console.log(groupMessages.data.message[i].chat);
            var div = document.createElement('div');
            div.className = 'msgs-div';
            div.textContent = `${groupMessages.data.message[i].chat}`;
            msgBox.appendChild(div);
        }
        // if (messages) {
        //     const last = 0;
        //     // console.log(last);
        //     const chat = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg?last=${last}`);
        //     const msg = localStorage.setItem('msg', JSON.stringify(chat.data.messages));
        //     showMsg(messages);

        // } else {
        //     last = messages[messages.length - 1].id;
        //     const chat = await axios.get(`http://localhost:4106/nexchat/chats/get-all-msg?last=${last}`);
        //     const msg = localStorage.setItem('msg', JSON.stringify(chat.data.messages));
        //     showMsg(messages);
        // }
    } catch (err) {
        console.log(err);
    }
}




// function showMsg(messages) {
//     try {

//         // let message = JSON.parse(localStorage.getItem('msg'));
//         // console.log(messages);
//         // console.log(user);
//         var masgBox = document.getElementById('msgBox');
//         masgBox.innerHTML = ''

//         for (let i = 0; i < messages.length; i++) {


//             const div = document.createElement('div');
//             div.textContent = `${messages[i].chat}`;
//             div.classList = 'msgs-div';
//             masgBox.appendChild(div);
//             scrollToBottom();
//         }


//     } catch (err) {
//         console.log(err);
//     }
// }

var logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    console.log('loggging out');
    localStorage.removeItem('token');
    window.location.href = './home.html';

})
