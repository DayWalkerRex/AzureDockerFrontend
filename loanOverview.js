loanOverview()

function loanOverview() {
    fetch('http://localhost:8080/api/userloan/loaned')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let table = document.getElementById("loan-overview");

            // ms: loop through each user
            data.forEach(loanOverviewDto => {

                let row = table.insertRow();

                let idCell = row.insertCell(0);
                idCell.innerHTML = loanOverviewDto.idTitle + "." + loanOverviewDto.idCopy;

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
            });
            console.log("It works!")
        })
        .catch(error => console.log(error));
}