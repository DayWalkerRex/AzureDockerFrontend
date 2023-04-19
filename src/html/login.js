function login() {
    //OO: Get value of fields 
    let emailValue = document.getElementById('login-email').value;
    let passwordValue = document.getElementById('login-password').value;
    //OO: Prepare Json message
    let loginRequestDto = {
        "email": emailValue,
        "password": passwordValue
    }

    //OO: Post fetch to backend 
    fetch("http://localhost:8080/api/user/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequestDto)
    })
    .then(response => response.json())
    .then(answer => {
        if (answer.success) {
            //OO: Backend gave back a token
            localStorage.setItem('WT-Token', answer.token);
            //OO: Go to index page
            location.replace("index.html")
        } else {
            //OO: No token was made by the backend because user/password is wrong
            alert('Authenticatie is mislukt');
        }
    })
    .catch(error => {
        console.error(error);
        alert('Fout opgetreden')
    });
}