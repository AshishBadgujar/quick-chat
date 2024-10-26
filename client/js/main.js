const addGroup = document.getElementById("add-group")
const groupsBox = document.querySelector('.users-box ul');
const sendBtn = document.getElementById('send')
const msgInput = document.getElementById('msg-input')
const msgBox = document.getElementById('msg-box');
const groupHeading = document.getElementById('group-heading')
let roomId = null;
let selectedGroup = null;
let socket = null;
let userName = localStorage.getItem('me') || null;

function getQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomId');
}

addGroup.addEventListener('click', (e) => {
    const title = prompt("Group Title")
    const passcode = prompt("Group Passcode")
    createGroup(title, passcode)
    addMeToGroup(userName, roomId)
})


window.onload = async function () {

    userName = localStorage.getItem('me')
    roomId = getQueryParam('roomId');

    while (!userName) {
        userName = prompt("Nickname (required):");

        if (!userName.trim()) {
            alert("Nickname is required");
            userName = "";
        }
    }
    if (userName && userName.trim()) {
        document.getElementById("nickname").innerText = userName;
        localStorage.setItem('me', userName)
        await loginMe(userName, btoa(userName), "https://avatar.iran.liara.run/public")
        const myGroups = await getMyGroups()
        displayGroups(myGroups)
    }
    if (roomId) {
        socket = io('/', {
            auth: {
                room: roomId
            }
        });

        selectedGroup = roomId
        const thisGroup = await getGroupInfo(roomId)
        groupHeading.innerText = thisGroup.title
        toggleVisibility()

        if (socket) {
            socket.on('message', (data) => {
                console.log("Received message from server:", data);
                displayMessage(data)
            });
        }
        //get group members
        const groupMembers = await getGroupMembers(roomId)
        console.log("group members=", groupMembers)
        if (!existsInGroup(groupMembers, userName)) {
            await addMeToGroup(userName, roomId)
        }
        displayGroupMembers(groupMembers)
        //get group previous chats
        const chats = await getChatsofRoom(roomId)
        displayPreviousMessages(chats)
    }
}


sendBtn.addEventListener('click', (e) => {
    const message = msgInput.value.trim();
    if (message) {
        console.log(`Message: ${message}`);
        if (socket) {
            socket.emit('message', { message, user: userName });
            displayMessage({ message, user: userName })
        }
        msgInput.value = '';
    } else {
        console.log("No message entered.");
    }
})

// ----------------------- API calls
async function loginMe(nickname, oauth_id, image) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname,
                oauth_id,
                image
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Store authentication token if required
        localStorage.setItem('authToken', data.token);
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getMyGroups() {
    try {
        const token = localStorage.getItem('authToken')
        const response = await fetch('/api/chat-group', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        });

        if (!response.ok) {
            throw new Error('getMyGroups failed');
        }

        const data = await response.json();
        console.log('getMyGroups successful:', data);
        return data.data
    } catch (error) {
        console.error('Error:', error);
    }
}
async function createGroup(title, passcode) {
    try {
        const token = localStorage.getItem('authToken')
        const response = await fetch('/api/chat-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                title,
                passcode
            })
        });

        if (!response.ok) {
            throw new Error('createGroup failed');
        }

        const data = await response.json();
        console.log('createGroup successful:', data);

    } catch (error) {
        console.error('Error:', error);
    }
}
async function getGroupMembers(roomId) {
    try {
        const response = await fetch(`/api/chat-group-user?group_id=${roomId}`);

        if (!response.ok) {
            throw new Error('groupMembers failed');
        }

        const data = await response.json();
        console.log('groupMembers successful:', data);
        return data.data
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getChatsofRoom(roomId) {
    try {
        const response = await fetch(`/api/chats/${roomId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('getChatsofRoom failed');
        }

        const data = await response.json();
        console.log('getChatsofRoom successful:', data);
        return data.data
    } catch (error) {
        console.error('Error:', error);
    }
}
async function addMeToGroup(nickname, roomId) {
    try {
        const response = await fetch('/api/chat-group-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nickname,
                group_id: roomId
            })
        });

        if (!response.ok) {
            throw new Error('addMeToGroup failed');
        }

        const data = await response.json();
        console.log('addMeToGroup successful:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getGroupInfo(roomId) {
    try {
        const response = await fetch(`/api/chat-group/${roomId}`);

        if (!response.ok) {
            throw new Error('getGroupInfo failed');
        }

        const data = await response.json();
        console.log('getGroupInfo successful:', data);
        return data.data
    } catch (error) {
        console.error('Error:', error);
    }
}



// --------------- UI manupulation
function displayMessage(data) {
    console.log("message=", data)
    const { message, user } = data;

    const messageElement = document.createElement('div');
    if (user === localStorage.getItem('me')) {
        messageElement.classList.add('card', 'primary');
        messageElement.innerHTML = `<p class="text-white">${message}</p>`;
        messageElement.style.alignSelf = 'flex-end'; // Align to the right for user messages
    } else {
        messageElement.classList.add('card', 'secondary');
        messageElement.innerHTML = `<p class="text-dark">${message}</p>`;
        messageElement.style.alignSelf = 'flex-start'; // Align to the left for others
    }
    console.log("appending=", messageElement)
    msgBox.appendChild(messageElement);

    msgBox.scrollTop = msgBox.scrollHeight;
}
function displayPreviousMessages(chats) {
    console.log("previous messages=", chats)
}
function displayGroupMembers(members) {
    console.log("members=", members)
}
function displayGroups(groups) {
    const usersBox = document.querySelector('.users-box ul');

    usersBox.innerHTML = '';

    groups.forEach(group => {
        const listItem = document.createElement('li');
        listItem.id = group.id
        const nameElement = document.createElement('h4');
        nameElement.textContent = group.title;

        const messageElement = document.createElement('p');
        messageElement.classList.add('gray');
        messageElement.textContent = group.id;

        listItem.appendChild(nameElement);
        listItem.appendChild(messageElement);

        listItem.addEventListener('click', () => {
            selectedGroup = group.id
            groupHeading.innerText = group.title
            updateURLQueryParam('roomId', listItem.id);
            toggleVisibility()

        });
        usersBox.appendChild(listItem);
    });

}
function toggleVisibility() {
    const groupImageDiv = document.getElementById('placeholder-image');
    const groupChatDiv = document.getElementById('group-chat-box');

    if (selectedGroup) {
        // If selectedGroup is set, show the header div
        groupChatDiv.style.display = 'block';
        groupImageDiv.style.display = 'none'; // Hide the image div
    } else {
        // If selectedGroup is not set, show the image div
        groupImageDiv.style.display = 'block';
        groupChatDiv.style.display = 'none'; // Hide the header div
    }
}
function updateURLQueryParam(key, value) {
    const url = new URL(window.location.href); // Get the current URL
    url.searchParams.set(key, value); // Set the new value for the specified key
    window.history.pushState({}, '', url); // Update the URL without reloading the page
}
function existsInGroup(groupMembers, myName) {
    const nameExists = groupMembers.some(member => member.name === myName);
    return nameExists;
}