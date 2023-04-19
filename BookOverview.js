// SASKIA
retrieveBooks();

function retrieveBooks() {
    fetch('http://localhost:8080/api/book/information/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let table = document.getElementById("bookInformation");

             // Add bookInformation data to table
             data.forEach(bookInformation => {

                let bookId = bookInformation.id

                //TL: Image do show in the browser now
                let row = table.insertRow();
                let imageCell = row.insertCell(0);
                let img = document.createElement("img");

                img.src = bookInformation.imageUrl; //ST use the dynamic url from database for the image
                img.width = 100;
                imageCell.appendChild(img);
                
                //TL: create a link from the title for a specific bookpage and pass bookId with URL
                let titleCell = row.insertCell(1);
                titleCell.innerHTML = `<a onclick = "this.href='bookDetail.html?bookId=' + '${bookId}'">${bookInformation.title}</a>`

                let authorCell = row.insertCell(2);
                authorCell.innerHTML = bookInformation.author;

                let isbnCell = row.insertCell(3);
                isbnCell.innerHTML = bookInformation.isbn;

                let numCopiesCell = row.insertCell(4);
                numCopiesCell.innerHTML = bookInformation.numCopies;

                let numRentedCell = row.insertCell(5);
                numRentedCell.innerHTML = bookInformation.numRented;

                // TL: creates tagcell and assigns tags to object. Creates a list of keywordTags for each book. If list empty -> show "no tags" 
                // TL: Check if bookTag is empty before join
                let tagsCell = row.insertCell(6);
                let tags = Object(bookInformation.tags); // ST: tags is a property of bookInformation, do we still need endpoints in the TagController
                let tagList = tags.map((ele) => ele.keywordTag);
                if (tagList.length == 0) {tagList.push("no tags")};
                tagsCell.innerHTML = tagList;

                //TL: create a cell for archivedbook and show if book is archived or not
                let archivedBookCell = row.insertCell(7) 
                archivedBookCell.innerHTML = bookInformation.archivedBook;

                //TL: create a cell for reservation button and creates button  
                let reservationCell = row.insertCell(8)
                let button = document.createElement('button');
                button.innerText = 'reserveren';

                // Get bookid to give to the button, Attaches sendReservation() function to 'onclick' attribute, Appends the button to the last column
                button.setAttribute('onclick', 'sendReservation('+bookId+')');
                reservationCell.appendChild(button);

                console.log("It works!")
            });
        })
        .catch(error => console.log(error));
}

function sendReservation(bookId) {

        let reservationUrl = 'http://localhost:8080/api/reservation/add'
        console.log(bookId)
        console.log(localStorage.getItem('WT-Token'))

        //TL: assign reservation variables for dto and creates JSON object (usertoken and bookid)
        let userToken = localStorage.getItem('WT-Token')
        let reservationDto = {

            'bookId' : bookId,
            'token' : userToken
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
            alert('Succesfully added reservation');
        })
        .catch(function(error) {
            alert(error);
        });

};
