

class user {
    constructor(firstname, lastname, emailID, password, confirmPassword) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.emailID = emailID;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}

module.exports = user