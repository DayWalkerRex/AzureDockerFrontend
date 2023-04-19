// SASKIA
// ST: Assigning input values
let confirmBtn = document.getElementById('confirm-button');
let selectedTagsContainer = document.getElementById("selected-tags");

renderDatalistTags();

// MS & ST: Get tags from database in dropdown suggestions
function renderDatalistTags() {
    fetch('http://localhost:8080/api/tag/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);

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
        tagElement.textContent = tag;

        const cancelBtn = document.createElement('button');
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
    console.log('tags', tagsElements)
    const tagSpanElems = tagsElements.querySelectorAll('span')
    console.log('spans', tagSpanElems)
    const selectedTags = []
    for (const span of tagSpanElems) {
        console.log('span', span.innerText)
        selectedTags.push(span.innerText.slice(0, -1));
    }
    console.log('selectedTags', selectedTags)

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
    console.log('bookInformationData', bookInformationData)

    // JB: Add bookInformation to the database
    fetch("http://localhost:8080/api/book/information/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem('WT-Token')
        },
        body: JSON.stringify(bookInformationData)
    })
    .then(response => {
        console.log('response', response)
        if (response.ok) {
            // ST: Retrieve the auto-generated bookInformationId
            return response.text();
         } else if (response.status === 409) {   // JB: reads error from backend if isbn alredy exists
             response.json().then(errorResponse => {
                 alert(errorResponse.message);
             });
         } else {
             alert('Error occurred during the saving of the new bookInformation!');
         }
     })
    .catch(error => {
        console.log('error2:', error);
        // alert('Error occurred during the adding of the tag to the table!');
    });
}

// ST: Load HML file completely before executing the .js file
document.addEventListener('DOMContentLoaded', () => {
    confirmBtn.addEventListener('click', () => {
        addBookInformation();
    });
});