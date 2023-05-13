const loadingPage = document.querySelector('.loadingPage');
const firebaseConfig = {
  apiKey: "AIzaSyB3R844AxKINjFYkAAOVwrTtS57bsu2xyU",
  authDomain: "catmodel-87974.firebaseapp.com",
  databaseURL: "https://catmodel-87974-default-rtdb.firebaseio.com",
  projectId: "catmodel-87974",
  storageBucket: "catmodel-87974.appspot.com",
  messagingSenderId: "1085738753846",
  appId: "1:1085738753846:web:5b7a614760c6947ade5d97",
  measurementId: "G-HXD4L0DJNX"
};


firebase.initializeApp(firebaseConfig)


var catModelDb = firebase.database().ref("users");

const loginNameinput = document.querySelector('#nameLogin');
const loginPassInput = document.querySelector('#passwordLogin');
const loginForm = document.querySelector('#loginForm');


loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting
  const loginName = loginNameinput.value;
  const loginPassword = loginPassInput.value;

  catModelDb.once('value', (snapshot) => {
    const users = snapshot.val();
    let isAuthenticated = false;

    for (let key in users) {
      if (users[key].name === loginName && users[key].password === loginPassword) {
        isAuthenticated = true;
        console.log('Logged in successfully.');
        window.location.href = "main.htm"; 

        
      localStorage.setItem('username', loginName);
      localStorage.setItem('password', loginPassword);

        break;
      }
    }

    if (!isAuthenticated) {
      alert('username or password is wrong');
    }
  });
});
window.addEventListener('load', () => {
  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');

  if (storedUsername && storedPassword) {
    loginNameinput.value = storedUsername;
    loginPassInput.value = storedPassword;
    loginForm.dispatchEvent(new Event('submit'));
  }
});
