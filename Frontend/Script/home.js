

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
        password: event.target.password.value
    }
    try {
        const user = await axios.post('http://localhost:4106/nexchat/user/sign-up', userInfo);
        if (user.status === 200) {
            alert('registration is done')
        }
        clearField(event);
    } catch (err) {
        console.log(err);
        console.log(err.response.status);
        if(err.response.status === 409){
            alert('you already are member of our comunity. please sign in ')
        }
    }
}

function clearField(event) {
    event.target.name.value = '';
    event.target.email.value = '';
    event.target.phoneNumber.value = '';
    event.target.password.value = '';
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
        console.log(user);
        if (user.status === 200) {
            alert('signin is done')
        }
        clearFields(event);
    } catch (Err) {
        console.log(Err);
    }
}

function clearFields(e) {
    e.target.email.value = '';
    e.target.password.value = '';
}