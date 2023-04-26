function listUsers() {

    console.log("listing Users")

    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/all')
        .then(response => response.json())
        .then(data => {
                var userDict = {};
                var i = 0;
                data.forEach(user => {
                    //tabel vullen
                    // tableHtml += `
                    //     <tr>
                    //         <td>${user.firstName}</td>
                    //         <td>${user.lastName}</td>
                    //         <td>${user.email}</td>
                    //         <td>${user.password}</td>
                    //         <td>${user.isAdmin}</td>
                    //     </tr>
                    // `
                    userDict[i] = {
                        FirstName: user.firstName
                    },
                    i += 1
                });

                document.getElementById('users').innerHTML = tableHtml;
        }).catch(alert('Er is een fout opgetreden'));

    console.log('succesfully retrieved Users')

    }

function dropdownuser(){ // don't leak
    var elm = document.getElementById('selectUser'), // get the select
        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    for (var i = 1; i <= 42; i++) { // loop, i like 42.
        var option = document.createElement('option'); // create the option element
        option.value = i; // set the value property
        option.appendChild(document.createTextNode("option #" + i)); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};