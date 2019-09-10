const os = require("os");

const logger = require("logger").createLogger("log.txt");
const yargs = require("yargs");

const users = require("./users");

var appUser = os.userInfo();

var command = process.argv[2];
var args = yargs.argv;
var userUsername = args.username;
var userPassword = args.password;
var userEmail = args.email;

var logStatus = "Failure";
var logMsg = "";

//validate data
if (command.match(/-/g)) {
	//no command sent
	logMsg = "Command not found!";
} else {
	//process command
	if (command === "create") {
		if (userUsername !== undefined && userPassword !== undefined && userEmail !== undefined) {
			var user = users.insertUser(userUsername, userPassword, userEmail);
			if (user) {
				logStatus = "Success";
				logMsg = `User Created: ${user.username} ${user.password} ${user.email}.`;
			} else {
				logMsg = `User not created: Duplicate User (${userUsername}) found!`;
			}
		} else {
			logMsg = "Missing User Data param(s).";
		}
	} else if (command === "read") {
		if (userUsername === undefined) {
			logMsg = "Missing User name param.";
		} else {
			var user = users.getUser(userUsername);
			if (user) {
				logStatus = "Success";
				logMsg = `User: ${user.username} ${user.email}.`;
			} else {
				logMsg = `User (${userUsername}) not found!`;
			}
		}
	} else if (command === "update") {
		if (userUsername !== undefined && userPassword !== undefined && userEmail !== undefined) {
			var user = users.updateUser(userUsername, userPassword, userEmail);

			if (user) {
				logStatus = "Success";
				logMsg = `User Updated: ${user.username} ${user.email}.`;
			} else {
				logMsg = `User (${userUsername}) not found!`;
			}
		} else {
			logMsg = "Missing User Data param(s).";
		}
	} else if (command === "delete") {
		if (userUsername === undefined && userPassword === undefined) {
			logMsg = "Missing User name param.";
		} else {
			var user = users.deleteUser(userUsername, userPassword);
			console.log(user);
			if (user) {
				logStatus = "Success";
				logMsg = `User (${userUsername}) deleted.`;
			} else {
				logMsg = `User (${userUsername}) not found!`;
			}
		}
	} else if (command === "list") {
		if (userUsername === undefined && userPassword === undefined) {
			logMsg = "Missing credentials.";
		} else if (userUsername !== "Admin" || userPassword !== "admin") {
			logMsg = "Invalid credentials";
		} else {
			var userList = users.listUsers();
			if (userList.length === 0) {
				logMsg = 'No users found.';
			} else {
                logStatus = 'Success';
                logMsg = ('Users:');
                userList.forEach((val) => {
                    logMsg += `${val.username}, ${val.email}'; `;
				});
			}
		}
	} else {
        logMsg = `Command (${command}) not able to be processed.`;
	}
}
// Write log file
logger.info('App accessed by', `${appUser.username}: ${logStatus} - ${logMsg}`);