'use strict';
/**************************************************/
/* Link this JS file before all other JS files!!! */
/**************************************************/
// this comment is great! but 'use strict'; has to be the absolute first line, above comments.

// Declare array to store all User instances.
var allUsers = [];

// Declare constructor for User instances..
function User(userName = '', loggedIn = false, allScores = []) {
  this.userName = userName;
  this.loggedIn = loggedIn;
  this.allScores = allScores;
  allUsers.push(this);
}

// Declare function to log in User.
function logInUser(loginForm) {
  var userNameValue = document.getElementById('user-name').value;

  if (userNameValue === '') {
    alert('Please enter a Username!');
  } else {
    if (allUsers.length === 0) {
      new User(userNameValue, true);
    } else {
      // let's make this a little smoother...
      var currentUser = allUsers.find(x => x.userName === userNameValue);
      if(currentUser) {
        currentUser.loggedIn = true;
      } else {
        new User(userNameValue, true);
      }
      // for (let i = 0; i < allUsers.length; i++) {
      //   if (allUsers[i].userName === userNameValue) {
      //     allUsers[i].loggedIn = true;
      //     break;
      //   } else if (allUsers[i].userName !== userNameValue) {
      //     falseUsers++;
      //   }
      // }
      // if (falseUsers === allUsers.length) {
      //   new User(userNameValue, true);
      // }
    }

    loginForm.reset();
    localStorage.setItem('users', JSON.stringify(allUsers));
    displayUser();
  }
}

// Declare function to display logged in User.
function displayUser() {
  var loggedInUser = allUsers.find(x => x.loggedIn);
  if (loggedInUser) {
    document.getElementById('logged-in-user').textContent = loggedInUser.userName;
  }
  document.getElementById('login-form').classList.toggle('hidden');
  document.getElementById('logout-form').classList.toggle('hidden');
}

// Declare function to log out User.
function logOutUser() {
  for (let i = 0; i < allUsers.length; i++) {
    allUsers[i].loggedIn = false;
  }
  localStorage.setItem('users', JSON.stringify(allUsers));
  document.getElementById('login-form').classList.toggle('hidden');
  document.getElementById('logout-form').classList.toggle('hidden');
}

function loadPage() {
  var loginForm = document.getElementById('login-form');
  var logoutButton = document.getElementById('logout-btn');

  if (localStorage.getItem('users') !== null) {
    var parsedUsers = JSON.parse(localStorage.getItem('users'));

    for (let i = 0; i < parsedUsers.length; i++) {
      new User(
        parsedUsers[i].userName,
        parsedUsers[i].loggedIn,
        parsedUsers[i].allScores
      );
    }
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].loggedIn === true) {
        displayUser();
      }
    }
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    logInUser(loginForm);
  });

  logoutButton.addEventListener('click', logOutUser);
}

loadPage();

/**************************************************************************/
/* Function to add random scores to active user until they have 10 scores */
/**************************************************************************/

// eslint-disable-next-line no-unused-vars
function addScores () {
  var scoreLength = 0;
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].loggedIn === true) {
      scoreLength = allUsers[i].allScores.length;
      for (var j = 0; j < 10 - scoreLength; j++) {
        allUsers[i].allScores.push(Math.round(Math.random() *
        ((8 + (allUsers[i].allScores.length * 2)) -
        (0 + (allUsers[i].allScores.length * 2))) +
        (0 + (allUsers[i].allScores.length * 2))));
      }
    }
  }
  localStorage.setItem('users', JSON.stringify(allUsers));
}

/****************************************************/
/* Functions to create test users & populate scores */
/****************************************************/
function randomScores() {
  var minMaxOffset = 0;
  var testScoreArray = [];
  for (var i = 0; i < 10; i++) {
    testScoreArray[i] = Math.round(Math.random() * ((8 + minMaxOffset) - (0 + minMaxOffset)) + (0 + minMaxOffset));
    minMaxOffset += 2;
  }
  return testScoreArray;
}

// eslint-disable-next-line no-unused-vars
function testUsers() {
  new User('Michelle', false, randomScores());
  new User('Lillian', false, randomScores());
  new User('Gina', false, randomScores());
  new User('Harlen', false, randomScores());
  new User('Blandine', false, randomScores());
  new User('Patrick', false, randomScores());
  new User('Ken', false, randomScores());
  new User('Eyob', false, randomScores());
  new User('Matthew', false, randomScores());
  localStorage.setItem('users', JSON.stringify(allUsers));
}
