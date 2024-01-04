

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

async function SignUp(event) {
    event.preventDefault();

    const userInfo = {
        name: event.target.name.value,
        email: event.target.email.value,
        phoneNumber: event.target.phoneNumber.value,
        password: event.target.password.value,
        confirmPassword: event.target.confirmPassword.value
    }
    try {
        var msg = document.getElementById('signupmsg');
        if (isValidPassword(event.target.password.value, event.target.confirmPassword.value)) {
            const user = await axios.post('http://localhost:4106/nexchat/user/sign-up', userInfo);
            if (user.status === 200) {
                alert('registration is done')
                msg.classList.add('msg');
                msg.textContent = 'Your ragistration is done successfully';
            }
            expires(msg);
            clearField(event);
        } else {
            if (event.target.password.value.length < 6) {
                // console.log('Password must be more than 6 letter');
                msg.classList.add('msg');
                msg.textContent = 'Error - Password must be more than 6 letter';
                expires(msg);

            } else if (event.target.password.value !== event.target.confirmPassword.value) {
                // console.log('password does not match');
                msg.classList.add('msg');
                msg.textContent = "Error - password doesn't match";
                expires(msg);

            } else {
                // console.log('Password should contain at least one small letter one capital letter and one numeric number');
                msg.classList.add('msg');
                msg.textContent = 'Error - Password must contain atleast one small letter, one capital letter and one numeric number'
                expires(msg);

            }
        }

    } catch (err) {
        console.log(err);
        console.log(err.response.status);
        if (err.response.status === 409) {
            msg.classList.add('msg');
            msg.textContent = 'Welcome back! It looks like you are already a part of our community.Please Sign in';
            expires(msg);
        }
    }
}
function isValidPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    // check for the lower case letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for number
    if (!/\d/.test(password)) {
        return false;
    }

    // if all condition are true then 
    return true;
}

function expires(msg) {
    setTimeout(() => {
        msg.classList.remove('msg')
        msg.textContent = '';
    }, 3000)
}
function clearField(event) {
    event.target.name.value = '';
    event.target.email.value = '';
    event.target.phoneNumber.value = '';
    event.target.password.value = '';
    event.target.confirmPassword.value = '';
}

// Sign In

async function SignIn(event) {
    event.preventDefault();

    const signin = {
        email: event.target.email.value,
        password: event.target.password.value
    }

    try {
        const user = await axios.post('http://localhost:4106/nexchat/user/sign-in', signin);
        console.log(user.data.token);
        if (user.status === 200) {
            localStorage.setItem("token", user.data.token);
            window.location.href = './chat.html';
            alert('signin is done')
        }
        clearFields(event);
    } catch (res) {
        console.log(res);
        var msg = document.getElementById('signinmsg');
        if (res.response.status === 404) {
            msg.classList.add('msg');
            msg.textContent = 'User Does not exist. Please sign up first'

        }
        else if (res.response.status === 401) {
            msg.classList.add('msg');
            msg.textContent = 'One or more field is incorrect. Try again'

        } else {
            msg.classList.add('msg');
            msg.textContent = 'Internal server error'
        }

        setTimeout(() => {
            msg.textContent = '';
            msg.classList.remove('msg');
        }, 3000)
    }
}

function clearFields(e) {
    e.target.email.value = '';
    e.target.password.value = '';
}