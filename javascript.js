
function retrieveUsers() {

    console.log("fetching Users")

    fetch('http://localhost:8080/api/user/all')
        .then(response => response.json())
        .then(data => {
            console.log('Data = ' + data)

                let tableHtml = `<tr>
                                    <th>Voornaam</th>
                                    <th>Achternaam</th>
                                    <th>Email</th>
                                    <th>Wachtwoord</th>
                                    <th>Admin?</th>
                                        </tr>`;
                data.forEach(user => {
                    //tabel vullen
                    tableHtml += `
                        <tr>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${user.password}</td>
                            <td>${user.isAdmin}</td>
                        </tr>
                    `
                });

                document.getElementById('users').innerHTML = tableHtml;
        }).catch(console.log("some error occured"));

    console.log('succesfully retrieved Users')

}


function addUser() {

    let inputFirstName = document.getElementById('input-firstname').value;
    let inputLastName = document.getElementById('input-lastname').value;
    let inputEmail = document.getElementById('input-email').value;
    let inputPassword = document.getElementById('input-password').value;
    //let inputIsAdmin = parseInt(document.querySelector('input[name="isAdmin"]:admin').value); 
    let inputIsAdmin = document.getElementById('input-isAdmin').Checked;  

    let user = {

        "firstName": inputFirstName,
        "lastName": inputLastName,
        "email": inputEmail,
        "password": inputPassword,
        "isAdmin": inputIsAdmin
    }

    console.log("isAdmin: "  + typeof(inputIsAdmin))
    console.log("user: " +  Object.values(user))

    fetch("http://localhost:8080/api/user/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                alert('Succesfully added user');
            })
            .catch(error => {
                alert('Error occured');
            });

}