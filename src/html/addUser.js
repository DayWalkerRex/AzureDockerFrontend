// ORLANDO
retrieveUsers();

function retrieveUsers() {

    console.log("fetching Users")

    // Fetching users from database
    fetch('http://localhost:8080/api/user/all')
        .then(response => response.json())
        .then(data => {

            // Show column names in console
            console.log('data: ' + Object.keys(data[0]))

                // Creating table headers
                let tableHtml = 
                `<tr>
                    <th>Voornaam</th>
                    <th>Achternaam</th>
                    <th>Email</th>
                    <th>Wachtwoord</th>
                    <th>Admin</th>
                </tr>`;
                data.forEach(user => {
                    // Adding data to table
                    tableHtml += 
                    `<tr>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.admin}</td>
                    </tr>`
        });
         // ST: The pop-ups don't work on my laptop       
        //create the table in html file
        document.getElementById('users').innerHTML = tableHtml;
        console.log('succesfully retrieved Users')

    //there is an error here but I am not sure where the error is -> everything seems to be working but it still yields an error
    }).catch(console.log("some error occured"));
}

function addUser() {

    //assigning input values
    let inputFirstName = document.getElementById('input-firstname').value;
    let inputLastName = document.getElementById('input-lastname').value;
    let inputEmail = document.getElementById('input-email').value;
    let inputPassword = document.getElementById('input-password').value;
    //let inputIsAdmin = parseInt(document.querySelector('input[name="isAdmin"]:admin').value); 
    //let inputIsAdmin = document.getElementById('input-isAdmin').Checked;  
    let inputIsAdmin = parseInt(document.querySelector('input[name="isAdmin"]:checked').value);

    //creating user
    let user = {

        "firstName": inputFirstName,
        "lastName": inputLastName,
        "email": inputEmail,
        "password": inputPassword,
        "admin": inputIsAdmin
    }

    //showing user values
    console.log("user: " +  Object.values(user))
    console.log("firstname-test:", typeof(inputFirstName))
    console.log("lastname-test:", typeof(inputLastName))
    console.log("email-test:", typeof(inputEmail))
    console.log("password-test:", typeof(inputPassword))
    console.log("admin-test:", typeof(inputIsAdmin))

    //adding user to the database
    fetch("http://localhost:8080/api/user/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    // ST: The pop-ups don't work on my laptop
    .then(response => {
        if (response.ok) {
             alert('Gebruiker succesvol toegevoegd'); //TL: changed this message to dutch
        } else if (response.status === 409) {   // BN: reads error from backend if email already exists
            response.json().then(errorResponse => {
                alert(errorResponse.message);
            });
        } else {    //BN: bij een andere error
            alert('Error occurred!');
        }
    })
    .catch(function(error) {
        alert(error);
    });

}



