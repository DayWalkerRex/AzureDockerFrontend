retrieveUsers();

function retrieveUsers() {

    //ST: Fetching users from database
    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/all')
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("user-overview");

            // Add user data to table
            data.forEach(user => {

                let row = table.insertRow(); //ST: create a new row for each user

                //ST: create a link from the username to the specific user and pass userId with URL
                let userId = user.id

                let firstNameCell = row.insertCell(0);
                //firstNameCell.innerHTML = `<a onclick = "this.href='userDetail.html?userId=' + '${userId}'">${user.firstName}</a>`
                firstNameCell.addEventListener("click", function() {goToPage(userId)});//BN calls the function when cell is clicked
                firstNameCell.innerHTML = user.firstName;

                let lastNameCell = row.insertCell(1);
                lastNameCell.addEventListener("click", function() {goToPage(userId)});
                lastNameCell.innerHTML = user.lastName;

                let emailCell = row.insertCell(2);
                emailCell.addEventListener("click", function() {goToPage(userId)});
                emailCell.innerHTML = user.email;

                let adminCell = row.insertCell(3);
                adminCell.addEventListener("click", function() {goToPage(userId)});

                if(user.admin == true) {adminCell.innerHTML = "Administrator"}
                else{adminCell.innerHTML = "Gebruiker"}


            });
        });
}

function goToPage(userId){//BN: function to go to userdetail after clicking cell
    window.location.href = 'userDetail.html?userId=' + userId;
}