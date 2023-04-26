retrieveReservations();

function retrieveReservations() {
    fetch('http://localhost:8080/api/reservation/all')
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("reservations");

            // ms: loop through each user
            data.forEach(reservationPageDto => {
                let bookTitles = reservationPageDto.bookTitles;

                // ms: loop through each reservation from the user and fill the table
                bookTitles.forEach(async (bookTitle, index) => {
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

                    //JB-#230: Make cell for loan button
                    let loanCell = row.insertCell(5);
                    loanCell.className = "ignore"

                    let bookInformationId = reservationPageDto.bookInformationId[index];
                    //JB-#230: get all the available bookcopies and place them in the dropdown
                    getAvailableBookCopies(bookInformationId)
                        .then((availableBookCopies) => {
                            if (availableBookCopies.length) {//JB-#230: Check if there are bookcopies available
                                //JB-#230: Create the input element
                                let inputElement = document.createElement("input");
                                //JB-#230: use bookInformation as postfix because we can have multiple dropdowns which need unique id's
                                let datalistId = "copy-dropdown-" + bookInformationId;
                                inputElement.setAttribute("list", datalistId);
                                inputElement.setAttribute("name", "book-information-" + bookInformationId);
                                inputElement.setAttribute("id", "input-copy-" + bookInformationId);

                                //JB-#230:Create the datalist element
                                let datalistElement = document.createElement("datalist");
                                datalistElement.setAttribute("id", datalistId);

                                //JB-#230: Get available bookcopies
                                availableBookCopies.forEach(copy => {
                                    let option = document.createElement('option');
                                    let copyNr = copy.copyNr;
                                    let optionValue = bookInformationId + "." + copyNr;

                                    //JB-#230: set the value attribute to select an option 
                                    option.setAttribute("value", optionValue);
                                    option.appendChild(document.createTextNode(optionValue));
                                    option.setAttribute('data-copy-id', copy.id); //JB-#230: set the copy id as data attribute                                    
                                    datalistElement.appendChild(option);
                                });
                                loanCell.appendChild(inputElement);
                                loanCell.appendChild(datalistElement);

                                // JB-#230: create a button
                                let loanButton = document.createElement('button');
                                loanButton.innerText = 'Toewijzen';

                                // JB-#230: Add event listener to connect copy id to the button
                                inputElement.addEventListener("change", function () {
                                    let selectedOption = document.querySelector('#' + datalistId + ' option[value="' + inputElement.value + '"]');
                                    inputElement.value = selectedOption ? selectedOption.value : null;
                                });

                                // JB-#230: Make loan button call assign reservation to loan a copy
                                loanButton.onclick = function () {
                                    let selectedOption = document.querySelector('#' + datalistId + ' option[value="' + inputElement.value + '"]');
                                    if (selectedOption) {
                                        assignReservation(selectedOption.dataset.copyId, bookInformationId, reservationPageDto.userId);
                                        alert('Reservering toegewezen')

                                        window.location.reload()
                                    } else {
                                        window.alert("Voer eerst een (bestaand) kopie in");
                                    }
                                };

                                //JB-#230: Add the function to the button
                                loanCell.appendChild(loanButton);


                            } else {//JB-#230: If there are no available copies, it is not possible to loan
                                loanCell.innerText = 'Geen kopieën beschikbaar';
                            }
                        })
                })
            });
        })
        .catch(error => alert(error));
}

//JB-#230: Get all available book copies for a book information
function getAvailableBookCopies(bookInformationId) {
    return fetch(`http://localhost:8080/api/book/copy/${bookInformationId}/available`)
        .then(response => response.json())
}

//JB-#230: Function to assign user loans
function assignReservation(bookCopyId, bookInformationId, userId) {
    fetch(`http://localhost:8080/api/userloan/${bookInformationId}/${userId}/${bookCopyId}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookStatus: 0
        })
    })

}

