
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const socket = io('http://localhost:4106', {
    auth: {
        token: localStorage.getItem('token')
    }
})
// DOM CONTENT LOADED
window.addEventListener('DOMContentLoaded', async () => {
    try {

        const headers = { 'authorization': localStorage.getItem('token') };

        const user = await axios.get('http://localhost:4106/nexchat/user/get-user-info', { headers });
        displayUserInformation(user.data)

        const grp = await axios.get('http://localhost:4106/nexchat/group/get-groups', { headers });
        displayGroupList(grp.data);

        const users = await axios.get('http://localhost:4106/nexchat/user/get-all-user', { headers });
        saveUserForaddingInGroup(users.data);

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

    for (var i = 0; i < user.users.length; i++) {
        var option = document.createElement('option');
        option.value = user.users[i].id;
        option.text = user.users[i].name;
        selectUser.appendChild(option);
    }
}

// CREATING GROUP
var createGroup = document.getElementById('createGroup');
createGroup.addEventListener('click', createGroups);

async function createGroups() {
    try {

        var notification = document.getElementById('notification');
        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        var selectUser = document.getElementById('selectUser');
        const selectedUsers = Array.from(selectUser.selectedOptions).map(option => option.value);

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
                setTimeout(() => {
                    location.reload();
                }, 1000)
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

    parent.innerHTML = '';

    for (var i = 0; i < grp.length; i++) {
        const li = document.createElement('li');
        li.className = 'group-li'
        li.textContent = `${grp[i].name}`;
        const currentGroup = grp[i];
        li.onclick = function () {
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

        const users = usersInAGroup.data.users;

        usersInfo.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'group-lii py-2';
            li.textContent = user.name;
            const makeAdmin = document.createElement('button');
            makeAdmin.className = 'btn btn-light makeAdmin ';
            makeAdmin.textContent = "Make Admin";
            makeAdmin.addEventListener("click", () => makeAdmins(user.id, user.name, groupId));

            const removeAdmin = document.createElement('button');
            removeAdmin.className = 'btn btn-light removeAdmin ';
            removeAdmin.textContent = "Remove Admin";
            removeAdmin.addEventListener("click", () => removeAdmins(user.id, user.name, groupId));

            const X = document.createElement('button');
            X.className = 'btn btn-danger xtra-style removeUser';
            X.value = user.id;
            X.textContent = 'X';
            X.addEventListener("click", () => removeUser(user.id, groupId));

            if (group.member.admin === true) {
                if (user.member.admin == false) {
                    li.appendChild(X);
                    li.appendChild(makeAdmin);
                } else if (user.member.owner === true && user.member.admin === true) {
                    const span = document.createElement('span');
                    span.className = 'adminText'
                    span.textContent = 'Owner';
                    li.appendChild(span);
                } else {
                    const span = document.createElement('span');
                    span.className = 'adminText'
                    span.textContent = 'Admin';
                    li.appendChild(span);
                    li.appendChild(removeAdmin);
                }
            }
            usersInfo.appendChild(li);
        });

        groupDetailsModalLabel.textContent = groupName;



        if (group.member.admin !== true) {
            document.getElementById("addButton+").style.display = "none";
        } else {
            document.getElementById("addButton+").style.display = "block";
        }


    } catch (err) {
        console.log(err);
    }

}


// REMOVING USER BY ADMIN IN AGROUP
async function removeUser(userId, groupId) {
    try {

        const body = {
            userId: userId,
            groupId: groupId
        }

        var removenotification = document.getElementById('remove-notification');


        const removeUser = await axios.post('http://localhost:4106/nexchat/group/remove-user', body);
        if (removeUser.status === 200) {
            removenotification.className = 'remove-notification';
            removenotification.textContent = 'User is removed.Go Back';
            setTimeout(() => {
                location.reload();
            }, 1000);
        }

    } catch (er) {
        console.log(er);
    }
}
async function removeAdmins(userId, userName, groupId) {
    try {
        const body = { userId, userName, groupId }

        var removenotification = document.getElementById('remove-notification');

        const removeAdmin = await axios.post('http://localhost:4106/nexchat/group/remove-admin', body);
        if (removeAdmin.status === 200) {
            removenotification.className = 'remove-notification';
            removenotification.textContent = 'User is removed.Go Back';
            setTimeout(() => {
                location.reload();
            }, 1000);
        }

    } catch (er) {
        console.log(er);
    }
}

// Make Admin
async function makeAdmins(userId, userName, groupId) {
    try {
        const body = {
            userId, userName, groupId
        }
        var removenotification = document.getElementById('remove-notification');

        const makeAdmin = await axios.post('http://localhost:4106/nexchat/group/make-admin', body);
        console.log(makeAdmin);
        if (makeAdmin.status === 200) {
            removenotification.className = 'remove-notification';
            removenotification.textContent = 'User is Admin';
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (error) {
        console.log(error);
    }
}
// TOGGLING MODELS BODY OF A GROUP HEADER - MEMBER LIST <-----> INPUT LIST
var addButton = document.getElementById('addButton+');
addButton.addEventListener('click', toggleAddUserSection);
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
            var option = document.createElement('option');
            option.value = allUser.data[i].id;
            option.text = allUser.data[i].name;
            selectAllUser.appendChild(option);
        }


    } catch (err) {
        console.log(err);
    }
}

// ADDING MORE USER BY ADMIN
var addmoreuser = document.getElementById('addmoreusers');
addmoreuser.addEventListener('click', addMoreUsers);
async function addMoreUsers(event) {
    try {

        event.preventDefault();
        const notification = document.getElementById('notification-two');

        const selectAllUser = document.getElementById('selectAllUser');

        const groupId = localStorage.getItem('groupId');

        const selectedUsers = Array.from(selectAllUser.selectedOptions).map(option => option.value);

        const body = {
            groupId: groupId,
            users: selectedUsers
        }


        const users = await axios.post(`http://localhost:4106/nexchat/group/add-more-user`, body);
        if (users.status === 200) {
            notification.className = 'notification-style';
            notification.textContent = `User is Added Succesfullly.Go back`;
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
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
var sendChat = document.getElementById('sendmessage');
sendChat.addEventListener('click', async () => {
    try {
        var message = document.getElementById('message-input');
        const headers = { 'authorization': localStorage.getItem('token') };
        const groupId = localStorage.getItem('groupId');

        const Messages = {
            message: message.value,
            groupId: groupId
        };
        socket.emit('message:send-message', Messages, () => {
            console.log(Messages);
            message.value = '';
            scrollToBottom();
        })
    } catch (err) {
        console.log(err);
    }
})

// FETCHING MESSAGES FROM BACKEND
async function fetchMsg(grpId, groupName) {
    try {

        localStorage.setItem('groupId', grpId);

        var grpname = document.getElementById('grp-name');
        grpname.textContent = groupName;
        const groupId = grpId;

        // Implement socket logic here
        socket.emit('join-room', groupId, (groupMessages, id, groupUser) => {
            console.log(groupMessages, id, groupUser);
            showMsg(groupMessages, groupUser, id)
            scrollToBottom();
        })

    } catch (err) {
        console.log(err);
    }
}



// DISPLAY THE MESSAGES TO THE SCREEN
function showMsg(messages, users, id) {
    try {
        var msgBox = document.getElementById('msg-Box');
        msgBox.innerHTML = ''

        for (var i = 0; i < messages.length; i++) {
            var li = document.createElement('span');
            if (messages[i].memberId === null) {
                console.log('hi');
                li.classList.add('msgs-div', 'text-start');
                li.textContent = `Removed User : ${messages[i].messages}`;

            } else if (id === messages[i].memberId) {
                console.log('hi2');
                li.classList.add('msgs-div', 'text-end');
                li.textContent = `You : ${messages[i].messages}`;
            } else {
                console.log('hi3');
                const u = users.find(user => user.member.id === messages[i].memberId)
                li.classList.add('msgs-div', 'text-start');
                li.textContent = `${u.name} : ${messages[i].messages}`;

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
    localStorage.removeItem('groupId');
    window.location.href = './home.html';
})
