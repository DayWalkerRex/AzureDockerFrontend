function addUser() {

    //assigning input values
    let inputFirstName = document.getElementById('input-firstname').value;
    let inputLastName = document.getElementById('input-lastname').value;
    let inputEmail = document.getElementById('input-email').value;
    let inputPassword = document.getElementById('input-password').value;
    let inputIsAdmin = parseInt(document.querySelector('input[name="isAdmin"]:checked').value);

    //creating user
    let user = {

        "firstName": inputFirstName,
        "lastName": inputLastName,
        "email": inputEmail,
        "password": inputPassword,
        "admin": inputIsAdmin
    }

    //adding user to the database
    fetch("http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.ok) {
             alert('Gebruiker succesvol toegevoegd'); //TL: changed this message to dutch
            document.getElementById('input-firstname').value = ''; // ST: Clears the inputfields after clicking the 'Gebruiker toevoegen' button
            document.getElementById('input-lastname').value = '';
            document.getElementById('input-email').value = '';
            document.getElementById('input-password').value = '';
            return response.text();
        } else if (response.status === 409) {   // BN: reads error from backend if email already exists
            response.json().then(errorResponse => {
                alert(errorResponse.message);
            });
        } else { //BN: bij een andere error
            alert('Er is een fout opgetreden.');
        }
    })
    .catch(function(error) {
        alert(error);
    });

}



