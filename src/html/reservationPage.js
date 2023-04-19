retrieveReservations();

function retrieveReservations() {
    fetch('http://localhost:8080/api/reservation/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let table = document.getElementById("reservations");

            // ms: loop through each user
            data.forEach(reservationPageDto => {
                console.log(reservationPageDto);

                bookTitles = reservationPageDto.bookTitles;

                // ms: loop through each reservation from the user and fill the table
                bookTitles.forEach((bookTitle, index) => {
                    let row = table.insertRow();

                    let firstNameCell = row.insertCell(0);
                    firstNameCell.innerHTML = reservationPageDto.firstName;

                    let lastNameCell = row.insertCell(1);
                    lastNameCell.innerHTML = reservationPageDto.lastName;

                    let emailCell = row.insertCell(2);
                    emailCell.innerHTML = reservationPageDto.email;

                    let bookTitleCell = row.insertCell(3);
                    bookTitleCell.innerHTML = bookTitle;

                    // MS: first create a date object from the json and after that format the date
                    let date = new Date(reservationPageDto.dates[index]);
                    let yyyy = date.getFullYear();
                    let mm = date.getMonth() + 1;
                    let dd = date.getDate();

                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;

                    let dateFormatted = dd + '-' + mm + '-' + yyyy;

                    let dateCell = row.insertCell(4);
                    dateCell.innerHTML = dateFormatted;

                })

            });
            console.log("It works!")
        })
        .catch(error => console.log(error));
}