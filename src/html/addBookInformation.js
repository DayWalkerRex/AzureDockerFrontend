// SASKIA
// ST: Assigning input values
let confirmBtn = document.getElementById('confirm-button');
let selectedTagsContainer = document.getElementById("selected-tags");

renderDatalistTags();

// MS & ST: Get tags from database in dropdown suggestions
function renderDatalistTags() {
    fetch('http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/tag/all')
        .then(response => response.json())
        .then(data => {

            let list = document.getElementById("tag-dropdown");

            // ST: Create option tag list
            data.forEach(Tag => {
                let option = document.createElement('option');
                option.value = Tag.keywordTag;
                list.appendChild(option);
            })
        })
}

let selectedTags = [];
let inputTag = document.getElementById("input-tag")

// ST: Add selected tags to show on browser
inputTag.addEventListener('change', (event) => {
    const newTag = event.target.value;
    if (!selectedTags.includes(newTag)) {
        selectedTags.push(newTag);
        showSelectedTags();
        inputTag.value = ''; // Empty the input field of the dropdown
    }
})

// ST: Add new tags to show on browser
inputTag.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const newTag = event.target.value.trim();
        if (newTag !== '' && !selectedTags.includes(newTag)) {
            selectedTags.push(newTag);
            showSelectedTags();
            inputTag.value = ''; // empty the input field of the dropdown
        }
    }
});

// ST: Displays selected tags in the selectedTagsContainer
// ST: Creates a span element around the tag and adds a cancel button to each tag
function showSelectedTags() {
    selectedTagsContainer.innerHTML = '';
    selectedTags.forEach(tag =>{
        const tagElement = document.createElement('span');
        tagElement.id = "tag-span"
        tagElement.textContent = tag;

        const cancelBtn = document.createElement('button');
        cancelBtn.id = "cancel-button" //TL: added this buttonid for css
        cancelBtn.textContent = 'x';
        cancelBtn.addEventListener('click', () => {
            selectedTags = selectedTags.filter(t => t !== tag);
            showSelectedTags();
        });
        tagElement.appendChild(cancelBtn);
        selectedTagsContainer.appendChild(tagElement);
    });
}

function addBookInformation() {

    // JB/ST: Assigning input values
    let inputImage = document.getElementById('input-image').value;
    let inputTitle = document.getElementById('input-title').value;
    let inputAuthor = document.getElementById('input-author').value;
    let bookInformationId = document.getElementById('input-isbn').value;
    let numCopies = document.getElementById('input-numCopies').value; //OO-#214 get input for number of book copies
    let tagsElements = document.getElementById('selected-tags');
    const tagSpanElems = tagsElements.querySelectorAll('span')
    const selectedTags = []
    for (const span of tagSpanElems) {
        selectedTags.push(span.innerText.slice(0, -1));
    }

    // ST: Create an object bookInformation
    let bookInformationData = {
        "imageUrl": inputImage, 
        "title": inputTitle,
        "author": inputAuthor,
        "isbn": bookInformationId,
        "selectedTags": selectedTags,
        // add bookCopy here
        "numCopies" : numCopies //OO-#214 JSON for number of book copies
    }  

    // JB: Add bookInformation to the database
    fetch("http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/book/information/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem('WT-Token')
        },
        body: JSON.stringify(bookInformationData)
    })
    .then(response => {
        if (response.ok) {
            // ST: Retrieve the auto-generated bookInformationId
            alert('Boek succesvol toegevoegd')
            // document.getElementById('input-image').value = ''; // ST: Clears the inputfields after clicking the 'Boek toevoegen' button
            // document.getElementById('input-title').value = '';
            // document.getElementById('input-author').value = '';
            // document.getElementById('input-isbn').value = '';
            // document.getElementById('input-numCopies').value = '';
            // document.getElementById('selected-tags').innerHTML = '';
            window.location.reload()
            return response.text();
         } else if (response.status === 409) {   // JB: reads error from backend if isbn alredy exists
             response.json().then(errorResponse => {
                 alert(errorResponse.message);
             });
         } else {
             alert('Er is een fout opgetreden bij het opslaan van een boek');
         }
     })
    .catch(error => {
        alert('fout:', error);
        // alert('Error occurred during the adding of the tag to the table!');
    });
}