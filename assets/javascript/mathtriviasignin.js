// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBUGJXN2wqbdOHO5v-LxQUZS8XkpZtZvgE",
    authDomain: "math-with-friends-f8d8c.firebaseapp.com",
    databaseURL: "https://math-with-friends-f8d8c.firebaseio.com",
    storageBucket: "math-with-friends-f8d8c.appspot.com",
    messagingSenderId: "175909531949"
  };
  firebase.initializeApp(config);
    
    /**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById('quickstart-sign-in').disabled = true;
    }


    function initApp() {
      
      firebase.auth().onAuthStateChanged(function(user) {
      
//this what connect the user from login. window.currentUser = user is one thats login currently
        if (user) {
            console.log("we got user detail as a string");
            console.log(user);
            window.currentUser = user;
          
        } else {
          // User is signed out.
          // [START_EXCLUDE silent]
          // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          // document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          // document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        // document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]

      // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }

    window.onload = function() {
      initApp();
    };