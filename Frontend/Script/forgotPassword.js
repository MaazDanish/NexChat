const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
async function resetPasswordwithEmail(event) {
    try {
        event.preventDefault();
        const email = event.target.email.value;

        var firstform = document.getElementById('first-form');

        const response = await axios.post(`http://localhost:4106/nexchat/password/send-otp-via-email/${email}`)
        console.log(response);
        if (response.status === 200) {
            firstform.style.display = 'none'
        }
    } catch (err) {
        console.log(err);
    }
}

async function verifyOTP(event) {
    try {
        event.preventDefault();
        var secondform = document.getElementById('second-form');
        var hiddenotp = document.getElementById('hidden-otp');
        const otp = event.target.otp.value;

        console.log(otp);
        const response = await axios.post(`http://localhost:4106/nexchat/password/verify-otp-via-email/${otp}`)
        if (response.status === 200) {
            secondform.style.display = 'none'
            hiddenotp.value = otp;
        }
    } catch (Error) {
        console.log(Error);
    }
}

async function updatePassword(event) {
    try {

        event.preventDefault();
        const msg = document.getElementById('msg');

        var otp = document.getElementById('hidden-otp').value;
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;

        const body = {
            password: password,
            otp: otp
        }

        // Checking if the passwords match
        if (isValidPassword(password, confirmPassword)) {
            const response = await axios.post(`http://localhost:4106/nexchat/password/update-password`, body)
            if (response.status === 200) {
                msg.textContent = 'Your password is updated Successfully';
            }

        } else {
            if (event.target.password.value.length < 6) {
                msg.textContent = 'Error - Password must be more than 6 letter';
                expires(msg);

            } else if (event.target.password.value !== event.target.confirmPassword.value) {
                msg.textContent = "Error - password doesn't match";
                expires(msg);

            } else {
                msg.textContent = 'Error - Password must contain atleast one small letter, one capital letter and one numeric number'
                expires(msg);

            }
        }
    } catch (err) {
        console.log(err);
    }
}

// testing email
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