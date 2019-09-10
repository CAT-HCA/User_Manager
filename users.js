//require file system module
const fs = require("fs");

//reading existing data from file
var getUsers = () => {
    try {
        var usersString = fs.readFileSync("users.json");
        return JSON.parse(usersString);
    } catch (err){
        return [];
    }
}

//save data to file
var saveUsers = (users) => {
    fs.writeFileSync("users.json", JSON.stringify(users));
};

// create/insert new user
var insertUser = (username, password, email) => {
    var users = getUsers();
    var user = {username, password, email}
}

//ensures no username or email dupes
var duplicateUsers = users.filter((user) => {
    return (user.username === username || user.email === email);
});

//validating no dupes, if none, save users
if (duplicateUsers.length === 0) {
    users.push(user);
    saveUsers(users);
    return user;
}

//get user by username 
var getUser = (username) => {
    var users = getUsers();
    var filteredUsers = users.filter((user) => user.username === username);
    return filteredUsers[0];
}

//update user (delete and insert)
var updateUser = (username, password, email) => {
    var users = getUsers();
    var filteredUsers = users.filter((user) =>
    (user.username === username && user.password == password));

    if (filteredUsers.length > 0) {
        //delete existing user
        deleteUser(username, password);
        //re-add with new info
        return insertUser(username, password, email);
    }
    return filteredUsers[0];
}

//delete user
var deleteUser = (username, password) => {
    var users = getUsers();
    var filteredUsers = users.filter((user) => user.username !== username || user.password !== password);

    saveUsers(filteredUsers);

    console.log(users.length);
    console.log(filteredUsers.length);

    return users.length !== filteredUsers.length;
}

//return all users
var listUsers = () => {
    return getUsers();
};

//exporting functions for use in app.js
module.exports = {
    insertUser,
    getUser,
    updateUser,
    deleteUser,
    listUsers
}