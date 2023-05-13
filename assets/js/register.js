
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

const nameInput = document.querySelector('#name');
const passwordInput = document.querySelector('#password');
const register = document.querySelector('#register');


passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!passwordRegex.test(password)) {
    passwordInput.setCustomValidity('Password must contain at least 8 characters and include at least one letter and one number.');
  } else {
    passwordInput.setCustomValidity('');
  }
});

register.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = nameInput.value;

  catModelDb.orderByChild('name').equalTo(username).once('value', (snapshot) => {
    if (snapshot.exists()) {
      alert('Username already exists!');
    } else {

      catModelDb.push({
        name: username,
        password: passwordInput.value
      });

      localStorage.setItem('username', username);
      localStorage.setItem('password', passwordInput.value);

      nameInput.value = '';
      passwordInput.value = '';

      location.href = "main.htm";
    }
  });
});
