const bookId = getBookIdFromUrl() //JB-#256 to prevent that we need to define the constant in every function
retrieveAndShowBookInformation(bookId)
retrieveCopies() //JB-#256: show all copies belanging to book

selectedIndices = []//array to keep track which copies have already been assigned

function getBookIdFromUrl() {//JB-#256: Made a function of it because it is used in more places
    //TL: get bookId from URL 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bookId = urlParams.get('bookId')

    return bookId;
}

function retrieveAndShowBookInformation(bookId) {
    //TL: fetch data from book that was clicked on in library page
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/${bookId}`)
        .then(response => response.json())
        .then(data => {

            //TL: put information of the book on the page
            document.getElementById("bookImage").src = data.imageUrl
            document.getElementById("bookTitle").innerHTML = data.title
            document.getElementById("book-ISBN").innerHTML = ("<b>ISBN: </b>" + data.isbn)
            document.getElementById("book-author").innerHTML = ("<b>Auteur: </b>" + data.author)
            document.getElementById("book-num-copies").innerHTML = ("<b>Aantal kopieën: </b>" + data.numCopies)
            document.getElementById("book-num-available").innerHTML = ("<b>Aantal beschikbaar: </b>" + data.numAvailableCopies) //OO : #253 changed column text and shown data
            let tags = Object(data.tags);
            let tagList = tags.map((ele) => ele.keywordTag);
            if (tagList.length == 0) { tagList.push("Geen tags") };
            document.getElementById("book-tags").innerHTML = ("<b>Tag(s): </b>" + tagList);
            if(data.archivedBook == true) {document.getElementById("book-archived-book").innerHTML = ('<b>Gearchiveerd</b>')}
            else {document.getElementById("book-archived-book").innerHTML = ('<b>Niet gearchiveerd</b>')}

        })
        .catch(function (error) {
            alert('Fout: ' + error)
        });

};
function listUsersToAssign() {//BN: when "toewijzen" is clicked, a list with users appears.
    document.getElementById('book-detail-assign-button').style.display = "none"
    document.getElementById('searchTerm').style.display = "initial"
    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/all')
        .then(response => response.json())
        .then(data => {

            // Creating table headers

            var tableHtml =
                `<tr>
                    <th>Voornaam</th>
                    <th>Achternaam</th>
                    <th>Email</th>
                    <th>Toewijzen</th>
                </tr>`;
            data.forEach(user => {
                // Adding data to table
                tableHtml +=
                    `<tr>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.email}</td>
                        <td class = "ignore">
                        <button id=${user.id} onclick=assignBookCopyToUser(this)>${"Kies deze persoon"}</button>
                        <select id=dropDown${user.id} style="display: none;">
                            <option value="" selected disabled hidden>Kies exemplaar</option>
                        </select>
                        <button id=sendIt${user.id} style="display: none;" onclick=console.log("no")>Go!</button>
                        </td>
                    </tr>`
                //BN:every user gets another button "assign" (line 59). button refers to function assignBookCopyToUser
            });
            //create the table in html file
            document.getElementById('users').innerHTML = tableHtml;

        })
}

function assignBookCopyToUser(button) {//BN: here a copy is selected to be assigned to user
    //BN: button.id is the user id
    userId = button.id;
    button.style.display = "none";//BN: hides the button
    dropDownCopies = document.getElementById("dropDown" + userId);//BN: selects the accompanying dropdown with book copies
    dropDownCopies.style.display = "initial";//BN: and turns it visible
    confirmButton = document.getElementById("sendIt" + userId);//BN: same for the confirm button
    confirmButton.style.display = "initial";
    bookCopies = [];
    bookCopyNr = [];
    getAvailableBookCopies(bookCopies, bookCopyNr).then(() => {//BN: rest of code has to wait until fetch has completed
        if (Object.keys(bookCopies).length == 0) { alert("Dit boek heeft geen (beschikbare) kopieën.") }
        bookCopies = Object.values(bookCopies)
        df = document.createDocumentFragment(); // BN: create a document fragment to hold the options while we create them
        for (var i = 0; i < bookCopies.length; i++) { // BN: later, for i in  available copies

            var option = document.createElement('option'); //BN:  create the option element
            option.value = bookCopies[i]; // set the value property
            option.appendChild(document.createTextNode(bookId + "." + bookCopyNr[i])); // BN: set the textContent in a safe way.
            df.appendChild(option); // BN: append the option to the document fragment

        }
        dropDownCopies.appendChild(df);

        confirmButton.onclick = function () { loanCopyToUser(); }//BN: when clicked, the function to post to database is called
    })//end of .then

}

const getAvailableBookCopies = async (allCopies, allCopyNr) => {//BN: gets the currently available book copies
    try {
        await fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/copy/${bookId}/available`)
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

    } catch (error) {
        alert("Geen beschikbare kopieën:" + error)
        return null;
    }
}

function loanCopyToUser() {//BN: does the actual posting to backend
    if (dropDownCopies.selectedIndex != 0) {//BN: so not the default unselected value
        let loan = { "bookStatus": "loaned" }//BN: makes an array to be sent to backend, bookId and usreId are implied from url
        if (!(selectedIndices.includes(dropDownCopies.selectedIndex))) {//BN: copy hasn't been assigned already
            alert("Uitgeleend: Boek " + dropDownCopies.options[dropDownCopies.selectedIndex].text + " aan gebruiker " + userId)   //BN: hier moet de userloan geupdate worden met fetch
            confirmButton.style.display = "none"; //BN: When a copy is assigned. remove the ability to assign more
            selectedIndices.push(dropDownCopies.selectedIndex)
            fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/userloan/${bookId}/${userId}/${dropDownCopies.value}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loan)
            })
            window.location.reload() //OO : #253 Refresh page when book loan is added
        }
        else { alert("Kopieën al uitgeleend") }
    }
    else { alert("Selecteer alstublieft een kopie.") }
    //BN: fetch bookcopies based on bookid
}



function addCopies(bookId) {
    let newNumCopy = document.getElementById('newNumCopy').value;

    //JB: confimation pop-up to confirm copies added
    if (confirm("Wil je " + newNumCopy + " kopie(ën) toevoegen?")) {
        fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/${bookId}/${newNumCopy}/copy`, {
            method: 'POST'
        })
            .then((response) => response.json()) //JB: Read body
            .then((payload) => { //JB: Read return value
                if (payload == true) {
                    alert(newNumCopy + ' Kopie(ën) toegevoegd');
                    location.reload(); //OO: #252 reload page to renew database info
                } else {
                    alert('Kan kopieën niet toevoegen');
                }
            })
            .catch(error => {
                console.error(error);
                alert('Fout opgetreden');
            });
    } else {
        alert("Kopieën toevoegen geannuleerd");
    }
};


//JB-#256: Make table with all book copies
function retrieveCopies() {
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/copy/${bookId}/all`)
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("bookCopy");

            data.forEach(bookCopy => {
                let row = table.insertRow();

                let bookNrCell = row.insertCell(0);
                bookNrCell.innerHTML = bookCopy.bookInformation.id + "." + bookCopy.copyNr;

                let avialableCell = row.insertCell(1);
                let avialable = bookCopy.available;
                if (avialable) {
                    avialableCell.innerHTML = "Beschikbaar"
                } else {
                    avialableCell.innerHTML = "Niet beschikbaar"
                };

                // let archivedCell = row.insertCell(2);
                // let archiveButton = document.createElement('button');
                // if (bookCopy.archived== false){//JB: Show archive button
                //     archiveButton.innerText = 'archiveren';
                // }else{//JB: show dearchive button
                //     archiveButton.innerText = 'dearchiveren';
                // }
                // archiveButton.setAttribute('onclick', 'archiveCopy('+bookCopy.id+', '+bookCopy.copyNr+')');
                // archivedCell.appendChild(archiveButton);
            })

        })

}
