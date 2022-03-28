const users = [];

function addUser(socketId, username) {
    const user = { socketId, username };
    users.push(user);
}

function getUsers() {
    return users;
}

function getNoOfUsers(){
    return users.length;
}

function getCurrentUser(id) {
    return users.find(user => user.socketId === id);
}

function userLeave(id) {
    let index = users.findIndex(user => user.socketId === id);
  
    if (index !== -1) {
      users.splice(index, 1);
    }
  }



module.exports = {
    addUser,
    getUsers,
    getNoOfUsers,
    getCurrentUser,
    userLeave
};