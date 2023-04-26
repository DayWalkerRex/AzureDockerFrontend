// SASKIA
retrieveBooks();

function retrieveBooks() {
    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/all',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('WT-Token')
            }
        }
    )
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("book-information");

            // Add bookInformation data to table
            data.forEach(bookInformation => {

            let bookId = bookInformation.id

                //TL: Image do show in the browser now
                let row = table.insertRow();
                let imageCell = row.insertCell(0);
                let img = document.createElement("img");
                imageCell.className = "bookOverview-click-cell";
                imageCell.addEventListener("click", function () { goToPage(bookId) });//BN added clicking functionality to all non-button cells

                img.src = bookInformation.imageUrl; //ST use the dynamic url from database for the image
                img.width = 100;
                imageCell.appendChild(img);

                //TL: create a link from the title for a specific bookpage and pass bookId with URL
                let titleCell = row.insertCell(1);
                titleCell.className = "bookOverview-click-cell";
                //titleCell.innerHTML = `<a class="bookOverviewTitleColumn" onclick = "this.href='bookDetail.html?bookId=' + '${bookId}'">${bookInformation.title}</a>`
                titleCell.addEventListener("click", function () { goToPage(bookId) });
                titleCell.innerHTML = bookInformation.title;

                let authorCell = row.insertCell(2);
                authorCell.className = "bookOverview-click-cell";
                authorCell.addEventListener("click", function () { goToPage(bookId) });
                authorCell.innerHTML = bookInformation.author;

                let isbnCell = row.insertCell(3);
                isbnCell.className = "bookOverview-click-cell";
                isbnCell.addEventListener("click", function () { goToPage(bookId) });
                isbnCell.innerHTML = bookInformation.isbn;

                let numCopiesCell = row.insertCell(4);
                numCopiesCell.className = "bookOverview-click-cell";
                numCopiesCell.addEventListener("click", function () { goToPage(bookId) });
                numCopiesCell.innerHTML = bookInformation.numCopies;
                numCopiesCell.className = "bookOverviewJsCopiesColumn";


                let numAvailableCell = row.insertCell(5);
                numAvailableCell.className = "bookOverview-click-cell";
                numAvailableCell.addEventListener("click", function () { goToPage(bookId) });
                numAvailableCell.innerHTML = bookInformation.numAvailableCopies; //OO : #253 changed column data name
                numAvailableCell.className = "bookOverviewJsAvailableColumn"; //OO : #253 changed column id name


                // TL: creates tagcell and assigns tags to object. Creates a list of keywordTags for each book. If list empty -> show "no tags" 
                // TL: Check if bookTag is empty before join
                let tagsCell = row.insertCell(6);
                tagsCell.className = "bookOverview-click-cell";
                tagsCell.addEventListener("click", function () { goToPage(bookId) });
                let tags = Object(bookInformation.tags); // ST: tags is a property of bookInformation, do we still need endpoints in the TagController

                let tagList = tags.map((ele) => " " + ele.keywordTag); //TL: 270 added spacing between tags
                if (tagList.length == 0) { tagList.push("no tags") };

                tagsCell.innerHTML = tagList;

                //TL: create a cell for archivedbook and show if book is archived or not
                //JB: updated cell such that it shows "archiveren" if not archived and visa versa
                let archivedBookCell = row.insertCell(7)
                archivedBookCell.className = "bookOverview-click-cell";
                archivedBookCell.className = "bookOverviewJsArchivedColumn";
                let archiveButton = document.createElement('button');
                if (bookInformation.archivedBook == false) {//JB: Show archive button
                    archiveButton.innerText = 'Archiveren';
                } else {//JB: show dearchive button
                    archiveButton.innerText = 'Dearchiveren';
                }
                archiveButton.setAttribute('onclick', 'archiveBookInformation(' + bookId + ')');
                archivedBookCell.appendChild(archiveButton);

                //TL: create a cell for reservation button and creates button  
                let reservationCell = row.insertCell(8)
                reservationCell.className = "bookOverview-click-cell";
                reservationCell.className = "ignore"; //BN#281 the buttons aren't included in search
                let button = document.createElement('button');
                button.setAttribute("id", "reservationButton")
                button.innerText = 'Reserveren';

                // Get bookid to give to the button, Attaches sendReservation() function to 'onclick' attribute, Appends the button to the last column
                button.setAttribute('onclick', 'sendReservation(' + bookId + ')');
                reservationCell.appendChild(button);

            });
        })
        .catch(error => alert(error));
}

function sendReservation(bookId) {

    let reservationUrl = 'http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/reservation/add'

    //TL: assign reservation variables for dto and creates JSON object (usertoken and bookid)
    let userToken = localStorage.getItem('WT-Token')
    let reservationDto = {

        'bookId': bookId,
        'token': userToken
    }

    //TL: fetch POST method for reservation to add a reservation
    fetch(reservationUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationDto)
    })
        .then(response => {
            if (response.ok) {
                alert('Reservering succesvol toegevoegd')
                return response.text();
            } else if (response.status === 409) {   // JB: reads error from backend if reservation alredy exists
                response.json().then(errorResponse => {
                    alert(errorResponse.message);
                });
            } else {
                alert('Er is een fout opgetreden tijdens het reserveren.');
            }
        })
        .catch(function (error) {
            alert(error);
        });

};

// JB-#257: function to (de)archive a bookCopy
function archiveBookInformation(bookId) {
    fetch(`http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/${bookId}/archive`)
        .then(response => response.json())
        .then(data => {
            if (data == true) {
                alert('Boek ' + bookId + ' gearchiveerd')
            }
            else {
                alert('Boek ' + bookId + ' gedearchiveerd')
            }
            window.location.reload()
        })
        .catch(error => alert(error))
}

function goToPage(bookId) {//BN: function to go to bookdetail after clicking cell
    window.location.href = 'bookDetail.html?bookId=' + bookId;
}