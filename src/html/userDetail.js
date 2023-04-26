// ST: Get userId from URL 
const userId = getUserIdFromUrl() // ST: to prevent that we need to define the constant in every function
retrieveAndShowUser(userId)
selectedBooks = [];

// ST: Made a function of it because it is used in more places
function getUserIdFromUrl(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('userId')
    //ST: Check if userID is found    
    return userId;
}

function retrieveAndShowUser() {
    //ST: fetch data from user that was clicked on in userOverview page
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            let role = "Gebruiker";
            if (data.admin) {role = "Administrator";}
            if (data.admin == true) {document.getElementById("archive-user-button").style.display='none'}//BN#281 corrected the role indicator. 
            //TL: display the user's information on the page
            document.getElementById("first-name").textContent = "Voornaam: " + data.firstName;
            document.getElementById("last-name").textContent = "Achternaam: " + data.lastName;
            document.getElementById("email").textContent = "Email: " + data.email;
            document.getElementById("admin-status").textContent = "Gebruikersrol: " + role;//BN#281 old method always showed admin, fixed.


            

        }).then(retrieveReservations())//BN: retrieve reservations only after user data has been retrieved
        .catch(function (error) {
            alert('fout: ' + error)
    });
}

function retrieveReservations() {//BN: retrieves reservations
    
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/reservation/${userId}`)
        .then(response => response.json())
        .then(data => {
            thisEmail = document.getElementById("email").textContent
            let table = document.getElementById("book-reserved-overview");
            bookTitles = data.bookTitles;
            // BN: loop through each reserved title
            bookTitles.forEach((bookTitle, index) => {
                let row = table.insertRow();

                let bookTitleCell = row.insertCell(0);//title
                bookTitleCell.innerHTML = bookTitle;

                let authorCell = row.insertCell(1);//auteur
                authorCell.innerHTML = data.authors[index];

                let isbnCell = row.insertCell(2);//isbn
                isbnCell.innerHTML = data.isbns[index];

                // MS: first create a date object from the json and after that format the date
                let date = new Date(data.dates[index]);
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                let dd = date.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                let dateFormatted = dd + '-' + mm + '-' + yyyy;

                let dateCell = row.insertCell(3);
                dateCell.innerHTML = dateFormatted;      
            })
                
        }).then(retrieveLoans(userId))//retrieve loans after reservations 
        .catch(error => alert(error));
}

function retrieveLoans() {//BN retrieves all loans of user
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/userloan/user/${userId}/loaned`)
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("book-possession-overview");

            // BN: loop through each active loan
            data.forEach(loanOverviewDto => {

                bookTitle = loanOverviewDto.title;


                let row = table.insertRow();

                let bookTitleCell = row.insertCell(0);//date
                bookTitleCell.innerHTML = bookTitle;

                let authorCell = row.insertCell(1);//auteur
                authorCell.innerHTML = loanOverviewDto.author;

                let isbnCell = row.insertCell(2);//isbn
                isbnCell.innerHTML = loanOverviewDto.isbn;

                // MS: first create a date object from the json and after that format the date
                let date = new Date(loanOverviewDto.assignDate);
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                let dd = date.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                let dateFormatted = dd + '-' + mm + '-' + yyyy;

                let dateCell = row.insertCell(3);
                dateCell.innerHTML = dateFormatted;  

                let copyCell = row.insertCell(4);//copy
                copyCell.innerHTML = loanOverviewDto.bookInformationId + "." + loanOverviewDto.copyNr; 
            });
        })
        .catch(error => alert(error));
}
//ST: Set user status to archived
function archiveUser(){

    let userEmail = 
    {
        "email" : document.getElementById("email").textContent.split(':')[1].trimStart()
    }

    //ST: Set user status to archived
    //ST: Adding user to the database
    // Add userId to backend, check userId in browser
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/archive`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userEmail)
    }).then(response => { //added this response
        if (response.ok) {
             alert('Gebruiker succesvol gearchiveerd'); 
        } else if (response.status === 409) {   
            response.json().then(errorResponse => {
                alert(errorResponse.message);
            });
        } else {    //BN: bij een andere error
            alert('Er is een fout opgetreden.');
        }
    })
    .catch(function (error) {
        alert('Fout: ' + error)
    });
}


// BN#281 all below: added a table to assign book copies similar to that in the bookdetail page, only with the role of user
// and book switched (you now select a book for one user, instead of selecting a user to receive one book)
function listBooksToAssign() {//BN: when "toewijzen" is clicked, a list with users appears.
    document.getElementById('book-detail-assign-button').style.display = "none"
    document.getElementById('searchTerm').style.display = "initial"
    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/all')
        .then(response => response.json())
        .then(data => {

                // Creating table headers
                
                var tableHtml = 
                `<tr>
                    <th>Titel</th>
                    <th>Auteur</th>
                    <th>ISBN</th>
                    <th>Toewijzen</th>
                </tr>`;
                data.forEach(book => {
                    // Adding data to table
                    tableHtml += 
                    `<tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td class=ignore>
                        <button id=${book.id} onclick=assignBookCopyToUser(this)>${"kies dit boek"}</button>
                        <select id=dropDown${book.id} style="display: none;">
                            <option value="" selected disabled hidden>Kies exemplaar</option>
                        </select>
                        <button id=sendIt${book.id} style="display: none;" onclick=console.log("no")>Go!</button>
                        </td>
                    </tr>`
                    //BN:every user gets another button "assign" (line 59). button refers to function assignBookCopyToUser
        });     
        //create the table in html file
        document.getElementById('books').innerHTML = tableHtml;
        
    })
}


function assignBookCopyToUser(button) {//BN: here a copy is selected to be assigned to user
    //BN: button.id is the user id
    bookId = button.id;
    button.style.display = "none";//BN: hides the button
    dropDownCopies = document.getElementById("dropDown" + bookId);//BN: selects the accompanying dropdown with book copies
    dropDownCopies.style.display = "initial";//BN: and turns it visible
    confirmButton = document.getElementById("sendIt" + bookId);//BN: same for the confirm button
    confirmButton.style.display = "initial";
    bookCopies = [];
    bookCopyNr = [];
    getAvailableBookCopies(bookCopies, bookCopyNr, bookId).then(()=>{//BN: rest of code has to wait until fetch has completed
    if(Object.keys(bookCopies).length == 0){alert("Dit boek heeft geen (beschikbare) kopieën.")}
    bookCopies = Object.values(bookCopies)
    df = document.createDocumentFragment(); // BN: create a document fragment to hold the options while we create them
    for (var i = 0; i < bookCopies.length; i++) { 

        var option = document.createElement('option'); //BN:  create the option element
        option.value = bookCopies[i]; // set the value property
        option.appendChild(document.createTextNode(bookId + "." + bookCopyNr[i])); // BN: set the textContent in a safe way.
        df.appendChild(option); // BN: append the option to the document fragment

    }
    dropDownCopies.appendChild(df);    

    confirmButton.onclick = function() { loanCopyToUser(bookId);}//BN: when clicked, the function to post to database is called
})//end of .then
    
}

const getAvailableBookCopies = async (allCopies, allCopyNr, bookId)  => {//BN: gets the currently available book copies
    try {await fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/copy/${bookId}/available`)
        .then(response => response.json())
        .then(data => {
            data.forEach(copy => {
               BODY: JSON.stringify(copy)
               allCopies.push(copy.id);
               allCopyNr.push(copy.copyNr);
               
            })
        })

    allCopies = Promise.resolve(allCopies)
    allCopyNr = Promise.resolve(allCopyNr)
    return allCopies, allCopyNr;
        
} catch (error) {alert("Geen beschikbare kopieën:" + error)
    return null;
}}

function loanCopyToUser(bookId){//BN: does the actual posting to backend
    if (dropDownCopies.selectedIndex != 0) {//BN: so not the default unselected value
        let loan = {"bookStatus": "loaned"}//BN: makes an array to be sent to backend, bookId and usreId are implied from url
        if (!(selectedBooks.includes(dropDownCopies.value))){//BN: copy hasn't been assigned already
            alert("Boek " + dropDownCopies.options[dropDownCopies.selectedIndex].text + " uitgeleend aan gebruiker")   //BN: hier moet de userloan geupdate worden met fetch
            confirmButton.style.display = "none"; //BN: When a copy is assigned. remove the ability to assign more
            selectedBooks.push(dropDownCopies.value)
            fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/userloan/${bookId}/${userId}/${dropDownCopies.value}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loan)
            })
        }
        else {alert("Kopie al uitgeleend")}
    }
    else {alert("Selecteer alstublieft een kopie.")}
    //BN: fetch bookcopies based on bookid
}

