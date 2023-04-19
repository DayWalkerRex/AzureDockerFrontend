// TOMMY


// when the full body of the html page is loaded the navbar loads in
window.onload = (event) => {

  //creating the navbar with class navbar, it creates hyperlinks for every page. 
  let navbar = `
  <div class="navbar">
    <div class="topnav">
        <a class="active" href="index.html">Home</a>
        <a href="bookOverview.html">Bibliotheek</a>
        <a href="addUser.html">Gebruiker toevoegen</a>
        <a href="addBookInformation.html">Boek toevoegen</a>
        <a href="assignBook.html">Boek toewijzen</a>
        <a href="login.html">Login</a>
        <a href="reservationPage.html">Reserveringen</a>
        <a href="loanOverview.html">Uitgeleend</a>
    </div>
  </div>`;

  //get the element with id topnav (div element in html) and change it to be the navbar
  document.getElementById('topnav').innerHTML = navbar;

  console.log("navbar is fully loaded");
};


