async function resetPassword(event) {
    try {
        event.preventDefault();
        const body = {
            email: event.target.email.value
        }

        const  response = await axios.post('')
        console.log(body);
    } catch (err) {
        console.log(err);
    }
}