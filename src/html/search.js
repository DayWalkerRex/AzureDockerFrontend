function searchTable(tableId, searchId) {
    let search = document.getElementById(searchId);
    let filter = search.value.toUpperCase(); //MS: To not be casesensitive, delete .toUppercase() if it has to be case sensitive.
    let table = document.getElementById(tableId);
    let tr = table.getElementsByTagName("tr");

    //MS: Store the text values of the cells in a different variable and let td be the cells in a row.
    let txtValue, td;

    //MS: Loop through the table rows.  
    Array.from(tr).forEach(tr => {
        td = tr.getElementsByTagName("td");

        // MS:Loop through the cells in a row and check if the cell contains the search letters.
        // MS: .every stops if false is returned and continues for true
        Array.from(td).every(cell => {
            txtValue = cell.innerText.toUpperCase(); //MS: also remove this .toUpperCase() for case sensitivity.
            if (txtValue.indexOf(filter) > -1) {
                tr.style.display = "";
                return false;
            } else {
                tr.style.display = "none";
                return true;
            }
        })
    })
}