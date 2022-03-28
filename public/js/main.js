// Get username from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const usersList = document.getElementById('usersList');
const nextButton = document.getElementById('nxt');
const selectSend = document.getElementById('selectSend');
const logoutBtn = document.getElementById('leave');

const socket = io();

// Join chatting
socket.emit('joinChatting', { username });

socket.on('profileDisplay', username=>{
    document.getElementById("profile").innerHTML = username;
});

socket.on("addUsersDisplay", users => {
    outputUsers(users);    
});

nextButton.addEventListener('click',function(){

    // Get message text
    let msg = document.getElementById('msg').value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    socket.emit('findNoOfUsers');

});

socket.on('knowNoOfUsers', (noOfUsers)=>{

    if (noOfUsers == 1){
        selectSend.innerHTML = "There are no active users to send the message";
        return;

    }
    
    socket.emit('getUsers', noOfUsers);
});

socket.on('knowUsersList', (users,noOfUsers)=>{
    //socket.emit('test',users);
    // console.log(users);
    var msg = document.getElementById('msg').value;
    msg = msg.trim();
    msg = msg.replace(/\r?\n/g, '<br />');;

    var container = document.getElementById('selectSend');
    let Label = document.createElement('label');
    Label.appendChild(document.createTextNode("Select the recipients"));

    container.appendChild(document.createElement('br'));
    container.appendChild(Label);
    container.appendChild(document.createElement('br'));

    let sender = document.getElementById('profile').innerHTML;
    
    users.forEach((user)=>{
        if (user.username != sender){
            let label = document.createElement('label')

            let Input = document.createElement('input');
            Input.type = 'checkbox';
            Input.name = 'names';
            Input.value = user.username;
            Input.id = user.socketId;

            label.appendChild(Input);
            label.appendChild(document.createTextNode(user.username));

            container.appendChild(label);
            container.appendChild(document.createElement('br'));
        }

    });

    var ele=document.getElementsByName('names'); 
    var selectAllButton = document.createElement('button');
    selectAllButton.type = "button";
    selectAllButton.innerHTML = "Select All";
    var deselectAllButton = document.createElement('button');
    deselectAllButton.type = "button";
    deselectAllButton.innerHTML = "Deselect All";

    container.appendChild(selectAllButton);
    container.appendChild(deselectAllButton);

    selectAllButton.addEventListener('click', function(){
        for(let i=0; i<ele.length; i++){   
            ele[i].checked=true;  
        }  
    });
    deselectAllButton.addEventListener('click',function(){
        for(let i=0; i<ele.length; i++){   
            ele[i].checked=false;  
        }                  
    });

    var sendButton = document.createElement('button');
    sendButton.type = "button";
    sendButton.innerHTML = "Send";

    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));
    container.appendChild(sendButton);

    sendButton.addEventListener('click', function(){
        let checkboxes = document.querySelectorAll('input[name="names"]:checked');
        let recipients = [];
        checkboxes.forEach((checkbox) => {
            recipients.push(checkbox.id);
        });

        if (recipients.length == noOfUsers-1){
            socket.emit('broadcast',msg);
        }
        else{
            socket.emit('unicast',recipients,msg);
        }

        let chats = document.getElementById('chats');

        msgDiv = document.createElement('div');
        msgDiv.style.backgroundColor = 'green';
        msgDiv.innerHTML = "You: <br>"+msg;

        chats.appendChild(msgDiv);
        chats.appendChild(document.createElement('br'));

        selectSend.innerHTML = '';
        document.getElementById('msg').value = '';
        document.getElementById('msg').focus();
    });
});

socket.on('message', (msg)=>{
    outputMessage(msg);
});

function outputUsers(users){
    usersList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;

        usersList.appendChild(li);
    });
}

function outputMessage(msg){
    let chats = document.getElementById('chats');

    msgDiv = document.createElement('div');
    msgDiv.style.backgroundColor = 'green';
    msgDiv.innerHTML = "From "+msg.sender+":<br>"+msg.text;

    chats.appendChild(msgDiv);
    chats.appendChild(document.createElement('br'));
    
}

logoutBtn.addEventListener('click', function(){
    window.location = '../index.html';
});
