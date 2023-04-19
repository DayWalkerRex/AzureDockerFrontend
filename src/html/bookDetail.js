retrieveAndShowBookInformation()

function retrieveAndShowBookInformation() {

    //TL: get bookId from URL 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bookId = urlParams.get('bookId')
    console.log(bookId);

    //TL: fetch data from book that was clicked on in library page
    fetch(`http://localhost:8080/api/book/information/${bookId}`)
        .then(response => response.json())
        .then(data => {

            //TL: put information of the book on the page
            document.getElementById("bookImage").src = data.imageUrl
            document.getElementById("bookTitle").innerHTML = data.title
            document.getElementById("bookISBN").innerHTML = ("<b>ISBN: </b>" + data.isbn)
            document.getElementById("bookAuthor").innerHTML = ("<b>Author: </b>" + data.author)
            document.getElementById("bookNumCopies").innerHTML = ("<b>Number of Copies: </b>" + data.numCopies)
            document.getElementById("bookNumRented").innerHTML = ("<b>Number of Rented: </b>" + data.numRented)
            let tags = Object(data.tags);
            let tagList = tags.map((ele) => ele.keywordTag);
            if (tagList.length == 0) { tagList.push("no tags") };
            document.getElementById("bookTags").innerHTML = ("<b>Tags: </b>" + tagList);
            document.getElementById("bookArchivedBook").innerHTML = ("<b>Archived status: </b>" + data.archivedBook)

        })
        .catch(function (error) {
            alert('error: ' + error)
        });

};

function addCopies() {
    //JB: get bookId from URL 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bookId = urlParams.get('bookId');
    console.log(bookId);

    let newNumCopy = document.getElementById('newNumCopy').value;

    //JB: confimation pop-up to confirm copies added
    if (confirm("Wil je " + newNumCopy + " kopie(ën) toevoegen?")) {
        fetch(`http://localhost:8080/api/book/information/${bookId}/${newNumCopy}/copy`, {
            method: 'POST'
        })
        .then((response) => response.json()) //JB: Read body
        .then((payload) => { //JB: Read return value
            console.log('Response: ', payload)
            if (payload == true) {
                alert(newNumCopy + ' kopie(ën) toegevoegd');
                location.reload(); //OO: #252 reload page to renew database info
            } else {
                alert('Kan kopieën niet toevoegen');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error occurred!');
        }); 
    } else {
        alert("Kopieën toevoegen geannuleerd");
    }
};