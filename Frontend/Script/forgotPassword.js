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
            alert('An OTP is send to your email address!');
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
            alert('OTp is macthed')
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
        console.log('Password');
        const msg = document.getElementById('msg');
        // console.log(document.getElementById('hidden-otp').value);


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
                // console.log('Password must be more than 6 letter');
                msg.textContent = 'Error - Password must be more than 6 letter';
                expires(msg);

            } else if (event.target.password.value !== event.target.confirmPassword.value) {
                // console.log('password does not match');
                msg.textContent = "Error - password doesn't match";
                expires(msg);

            } else {
                // console.log('Password should contain at least one small letter one capital letter and one numeric number');
                msg.textContent = 'Error - Password must contain atleast one small letter, one capital letter and one numeric number'
                expires(msg);

            }
        }
    } catch (err) {
        console.log(err);
    }
}


async function resetPasswordwithNumber(event) {
    try {
        event.preventDefault();
        const body = {
            phoneNumber: event.target.phoneNumber.value
        }

        // const response = await axios.post('')
        console.log(body);
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
function expireMsg(msg) {
    setTimeout(() => {
        msg.textContent = '';
    }, 3000)
}