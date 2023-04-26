loanOverview()

function loanOverview() {
    fetch('http://localhost:8080/api/userloan/loaned')
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("loan-overview");

            // ms: loop through each user
            data.forEach(loanOverviewDto => {

                let row = table.insertRow();

                let idCell = row.insertCell(0);
                idCell.innerHTML = loanOverviewDto.bookInformationId + "." + loanOverviewDto.copyNr;

                let bookTitleCell = row.insertCell(1);
                bookTitleCell.innerHTML = loanOverviewDto.title;

                let authorCell = row.insertCell(2);
                authorCell.innerHTML = loanOverviewDto.author;

                let firstNameCell = row.insertCell(3);
                firstNameCell.innerHTML = loanOverviewDto.firstName;

                let lastNameCell = row.insertCell(4);
                lastNameCell.innerHTML = loanOverviewDto.lastName;

                // MS: first create a date object from the json and after that format the date
                let date = new Date(loanOverviewDto.assignDate);
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                let dd = date.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                let dateFormatted = dd + '-' + mm + '-' + yyyy;

                let dateCell = row.insertCell(5);
                dateCell.innerHTML = dateFormatted;

                //MS: Maken an return cell and input a button that calls the returnBook function
                let returnCell = row.insertCell(6);
                returnCell.innerHTML = `<button onclick = "returnBook('${loanOverviewDto.userLoanId}','${loanOverviewDto.title}','${loanOverviewDto.firstName}','${loanOverviewDto.lastName}','${dateFormatted}')" >Inleveren</button>`;

                let lostCell = row.insertCell(7);
                lostCell.innerHTML = `<button onclick = "lostBook('${loanOverviewDto.userLoanId}','${loanOverviewDto.title}','${loanOverviewDto.firstName}','${loanOverviewDto.lastName}','${dateFormatted}')" >Kwijt</button>`;
            });
        })
        .catch(error => alert(error));
}

//MS: Make a JSON with the userLoanId, let the admin confirm the right book, return the book with a fetch and reload the page
function lostBook(userLoanId, title, firstName, lastName, date) {
    lostJSON = {
        "userLoanId": userLoanId
    }

    confirm(`Weet je zeker dat je het volgende boek als kwijt wil markeren:
 \n titel: ${title}
 \n voornaam: ${firstName}
 \n achternaam: ${lastName}
 \n datum uitgeleend: ${date}`
    );

    fetch("http://localhost:8080/api/user/loan/lost", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lostJSON)
    })
        .then(window.location.reload());
}

//MS: Make a JSON with the userLoanId, let the admin confirm the right book, mark the book as lost with a fetch and reload the page
function returnBook(userLoanId, title, firstName, lastName, date) {
    returnJSON = {
        "userLoanId": userLoanId
    }

    confirm(`Weet je zeker dat je het volgende boek wilt inleveren:
 \n titel: ${title}
 \n voornaam: ${firstName}
 \n achternaam: ${lastName}
 \n datum uitgeleend: ${date}`
    );

    fetch("http://localhost:8080/api/user/loan/return", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(returnJSON)
    })
        .then(window.location.reload());
}