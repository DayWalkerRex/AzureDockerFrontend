// TOMMY


// when the full body of the html page is loaded the navbar loads in
window.onload = (event) => {

  //creating the navbar with class navbar, it creates hyperlinks for every page. 
  //   TL: commented this out the navbar      <a id="assignBookPageId" href="assignBook.html">Boek toewijzen</a> 

  let navbar = `
  <div class="navbar">
    <div class="topnav">
        <a id="indexPageId" href="index.html">Home</a>
        <a id="bookOverviewPageId" href="bookOverview.html">Bibliotheek</a>
        <a id="reservationPageId" href="reservationPage.html">Reserveringen</a>
        <a id="loanOverviewPageId" href="loanOverview.html">Uitgeleend</a>
        <a id="userOverviewPageId" href="userOverview.html">Gebruikersoverzicht</a>
        <a id="addUserPageId" href="addUser.html">Gebruiker toevoegen</a>
        <a id="addBookInformationPageId" href="addBookInformation.html">Boek toevoegen</a>
        <img id="navbarImg" src="https://www.jouwictvacature.nl/image/Company/Logo/0012p000041aQ4LAAU" alt="Working Talent">
    </div>
  </div>`;

  //get the element with id topnav (div element in html) and change it to be the navbar
  document.getElementById('topnav').innerHTML = navbar;
  changeVisbility();

};



function changeVisbility() {

  fetch("http://wtlibrary.b7dacte6cff2a0cn.eastus.azurecontainer.io:8080/api/user/token", {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('WT-Token')
        }
    })
    .then(response => response.json())
    .then(data => {
      

      //TL: Determine the role and id of the user
      let role = Object.values(data[0]);
      let id = Object.values(data[1])

      //TL: If user has no role -> go back to login
      if (role == "none") {
        window.location.replace("login.html");
      }
      //TL: if role is user-role -> do not display admin-pages and do not display admin information in bookOverview table
      else if(role == "user") {

        //TL: check if you are on the index page -> change to userDetail page
        var regexIndex = new RegExp("/index.html");
        if(document.URL.match(regexIndex)) {
          window.location.replace(`userDetail.html?userId=${id}`)
        }
        //do not display admin links for user in the navbar
        document.getElementById("indexPageId").innerText = "Account";
        document.getElementById("addBookInformationPageId").style.display = "none";
        document.getElementById("addUserPageId").style.display = "none";
        document.getElementById("userOverviewPageId").style.display = "none";
        document.getElementById("reservationPageId").style.display = "none";
        document.getElementById("loanOverviewPageId").style.display = "none";


        //TL: if the user is on bookOverview -> do not show admin-columns
        var regexBookOverview = new RegExp("/bookOverview.html");
        if(document.URL.match(regexBookOverview)) {
          //do not show if book is archived to user in bookoverview
          document.getElementById("bookOverviewArchivedColumn").style.display = "none";
          let archivedColumn = document.getElementsByClassName('bookOverviewJsArchivedColumn');
          for (var i=0;i<archivedColumn.length;i+=1){
            archivedColumn[i].style.display = 'none';
          }

          //TL: turn off the ability to click the title
          let titleColumn = document.getElementsByClassName('bookOverviewTitleColumn');
          for (var i=0;i<titleColumn.length;i+=1){
            titleColumn[i].style.cursor = 'default';
            titleColumn[i].style.pointerEvents = 'none';
          }
        }

         //TL: if the user is on userDetail -> do not show arhive-button
         var regexUserDetail = new RegExp("/userDetail.html");
         if(document.URL.match(regexUserDetail)) {
           document.getElementById("archive-user-button").style.display = "none";
           document.getElementById("book-detail-assign-button").style.display = "none";
           document.getElementById("assign-book-h2").style.display = "none";
           }
      }
      else if(role == "admin") {

        var regexIndex = new RegExp("/index.html");
        if(document.URL.match(regexIndex)) {
          window.location.replace(`userDetail.html?userId=${id}`)
        }

        document.getElementById("indexPageId").innerText = "Account";
      };
    })
    .catch(function(error) {
        alert(error);
    });

}


