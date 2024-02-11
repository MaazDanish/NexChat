// DOM CONTENT LOADED
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // console.log('hiiiii');
        const headers = { 'authorization': localStorage.getItem('token') };
        // console.log(headers.authorization);
        const user = await axios.get('http://localhost:4106/nexchat/user/getUserInfo', { headers });
        // console.log(user);
        displayUserInformation(user.data)
        // fetchMsg();

        const grp = await axios.get('http://localhost:4106/nexchat/group/get-groups', { headers });
        displayGroupList(grp.data);
        // console.log(grp.data);

        const users = await axios.get('http://localhost:4106/nexchat/user/get-all-user', { headers });

        // console.log(users.data.users);
        saveUserForaddingInGroup(users.data);
        // toggleAddUserSection(users.data);
    } catch (err) {
        console.log(err);
    }
})

//  DISPLAYING THE  USERS INFO 
function displayUserInformation(user) {
    localStorage.setItem('userId', user.id)
    document.getElementById('userInfo').innerHTML = `
    <p class="text-color"><h5>Name</h5> ${user.name}  </p>
    <p class="text-color"><h5>Email</h5> ${user.email}</p>
    <p class="text-color"><h5>Phone Number</h5> ${user.phoneNumber}</p>
    `
}

// ASSIGNING USER FRO ADDING IN GROUP
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
    // toggleAddUserSection(user);
}

// CREATING GROUP
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

// DISPLAYTING GROUP LIST 
function displayGroupList(grp) {
    const parent = document.getElementById('groupList');
    // console.log(grp);
    parent.innerHTML = '';
    for (var i = 0; i < grp.length; i++) {
        // console.log(grp[i].id);
        const li = document.createElement('li');
        // li.setAttribute('group-id', grp[i].id);
        li.className = 'group-li'
        li.textContent = `${grp[i].name}`;
        const currentGroup = grp[i];
        li.onclick = function () {
            // console.log(currentGroup.id);
            // console.log(li.getAttribute('group-id'));
            // setInterval(() => {

            // }, 1000)
            fetchMsg(currentGroup.id, currentGroup.name)
            displayGroupDetails(currentGroup.id, currentGroup.name, currentGroup);
        }
        parent.appendChild(li);
    }

}

// DISPLAYING GROUP DEATILS LIKE GROUP NAME , ADMIN , MEMBERS IN IT
async function displayGroupDetails(groupId, groupName, group) {
    try {
        var groupDetailsModalLabel = document.getElementById('groupDetailsModalLabel');
        var usersInfo = document.getElementById('usersInfo');

        const usersInAGroup = await axios.get('http://localhost:4106/nexchat/group/get-all-group-users', {
            params: {
                groupId: groupId
            }
        });

        const users = usersInAGroup.data[0].users;
        // console.log(users);
        usersInfo.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'group-li py-2';
            li.textContent = user.name;

            const X = document.createElement('button');
            X.className = 'btn btn-danger xtra-style removeUser';
            X.value = user.id;
            X.textContent = 'X';
            X.addEventListener('click', () => removeUser(user.id, groupId));
            if (group.member.admin === true) {
                li.appendChild(X);
            }
            usersInfo.appendChild(li);
        });
        // console.log(usersInAGroup.data[0]);
        // console.log(groupName);
        groupDetailsModalLabel.textContent = groupName;


        // console.log(group.member.admin);
        if (group.member.admin !== true) {
            document.getElementById("addButton+").style.display = "none";
        } else {
            document.getElementById("addButton+").style.display = "block";
            // document.getElementsByClassName('removeUser').style.display = 'block';

        }


    } catch (err) {
        console.log(err);
    }

}


// REMOVING USER BY ADMIN IN AGROUP
async function removeUser(userId, groupId) {
    try {
        // console.log(userId, groupId);
        // console.log('Hello This is remove user function');

        const body = {
            userId: userId,
            groupId: groupId
        }

        var removenotification = document.getElementById('remove-notification');


        const removeUser = await axios.post('http://localhost:4106/nexchat/group/remove-user', body);
        // console.log(removeUser);
        if (removeUser.status === 200) {
            removenotification.className = 'remove-notification';
            removenotification.textContent = 'User is removed.Go Back';
        }

    } catch (er) {

    }
}

// TOGGLING MODELS BODY OF A GROUP HEADER - MEMBER LIST <-----> INPUT LIST
async function toggleAddUserSection() {
    try {
        const addUserSection = document.getElementById('addUserSection');
        const addButton = document.getElementById('addButton+');
        const selectAllUser = document.getElementById('selectAllUser');
        const groupId = localStorage.getItem('groupId');

        if (memberListSection.style.display === 'none') {
            memberListSection.style.display = 'block';
            addUserSection.style.display = 'none';
            addButton.textContent = '+';
        } else {
            memberListSection.style.display = 'none';
            addUserSection.style.display = 'block';
            addButton.textContent = '<--';

        }
        selectAllUser.innerHTML = '';
        const allUser = await axios.get(`http://localhost:4106/nexchat/user/get-more-users/${groupId}`);
        for (var i = 0; i < allUser.data.length; i++) {
            // console.log(allUser.data[i]);
            var option = document.createElement('option');
            option.value = allUser.data[i].id;
            option.text = allUser.data[i].name;
            selectAllUser.appendChild(option);
        }


    } catch (err) {
        console.log(err);
    }

    // console.log(users);
}

// ADDING MORE USER BY ADMIN
async function addMoreUser(event) {
    try {

        event.preventDefault();
        const notification = document.getElementById('notification-two');

        const selectAllUser = document.getElementById('selectAllUser');

        const groupId = localStorage.getItem('groupId');
        const selectedUsers = Array.from(selectAllUser.selectedOptions).map(option => option.value);
        // console.log(selectedUsers);

        const body = {
            groupId: groupId,
            users: selectedUsers
        }


        const users = await axios.post(`http://localhost:4106/nexchat/group/add-more-user`, body);
        // console.log(users.status);
        if (users.status === 200) {
            notification.className = 'notification-style';
            notification.textContent = `User is Added Succesfullly.Go back`;
        }
        // console.log(users);
    } catch (err) {
        console.log(err);
    }

}

// AUTOMATIC SCROLL BOTTOM WHEN USERS CHATS 
function scrollToBottom() {
    var chatContainer = document.getElementsByClassName("chatContainer");
    chatContainer[0].scrollTop = chatContainer[0].scrollHeight;
}

// SENDING MESSAGESD
var sendChat = document.getElementById('sendchat');
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

// FETCHING MESSAGES FROM BACKEND
async function fetchMsg(grpId, groupName) {
    try {

        localStorage.setItem('groupId', grpId);

        const headers = { 'authorization': localStorage.getItem('token') };
        var msgBox = document.getElementById('msgBox');

        var grpname = document.getElementById('grp-name');



        grpname.textContent = groupName;

        const groupMessages = await axios.get('http://localhost:4106/nexchat/chats/get-group-msg', { params: { groupId: grpId } })
        // console.log(groupMessages);
        showMsg(groupMessages)


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



// DISPLAY THE MESSAGES TO THE SCREEN
function showMsg(messages) {
    try {
        var msgBox = document.getElementById('msg-Box');

        msgBox.innerHTML = ''

        for (var i = 0; i < messages.data.message.length; i++) {

            // console.log(messages.data.message[i].member.userId, 'all user id');

            var li = document.createElement('span');

            const userId = Number(localStorage.getItem('userId'));
            // console.log(typeof (userId), 'testing logging user id');

            if (userId === messages.data.message[i].member.userId) {
                li.classList.add('msgs-div', 'text-end');
                li.textContent = `You : ${messages.data.message[i].chat}`;

            } else {
                li.classList.add('msgs-div', 'text-start');
                li.textContent = `${messages.data.message[i].chat}`;
            }

            msgBox.appendChild(li);

        }
    } catch (err) {
        console.log(err);
    }
}


// LOGGING OUT THE USERS 
var logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    console.log('loggging out');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // localStorage.removeItem('users');
    localStorage.removeItem('groupId');
    window.location.href = './home.html';
})
