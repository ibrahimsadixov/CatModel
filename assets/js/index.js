
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


var catModelDb = firebase.database().ref("catModel");

var users = firebase.database().ref("user");


document.getElementById("myData").addEventListener("submit", submitForm)
function submitForm(e) {
  e.preventDefault();

  var fileInput = document.getElementById("file");
  var nameInput = document.getElementById("name");
  var file = fileInput.files[0];
  var name = nameInput.value;

  if (file) {
    saveMessage(file, name);
    fileInput.value = "";
    nameInput.value = "";
  } else {
    console.log("No file selected");
  }
}





const storageRef = firebase.storage().ref();
const saveMessage = (file, name) => {
  const metadata = {
    contentType: file.type
  };

  const uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

  uploadTask.on('state_changed', null, null, () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      const myCat = catModelDb.push();
      myCat.set({
        file: downloadURL,
        name: name,
        like: 0
      });
      console.log("File saved:", downloadURL, name);
    });
  });
};

const imageDiv = document.getElementById("content");
catModelDb.on("value", (snapshot) => {
  imageDiv.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    const catDiv = document.createElement("div");
    catDiv.classList.add("cats");

    const imgElement = document.createElement("img");
    imgElement.classList.add("catImage");
    imgElement.src = childData.file;

    const catName = document.createElement("div");
    catName.classList.add("catName");

    const cat = document.createElement("p");
    cat.innerHTML = childData.name;

    const likes = document.createElement("div");
    likes.classList.add("likes");

    const likeIcon = document.createElement("i");
    likeIcon.classList.add("fa-solid");
    likeIcon.classList.add("fa-cat");
    likeIcon.classList.add("likeIcon");

    const likeCount = document.createElement("p");
    likeCount.classList.add("likeCount");
    likeCount.innerHTML = childData.like;

    const catId = childSnapshot.key;
    const catRef = catModelDb.child(catId);
    const username = localStorage.getItem("username");

    // Check if the user has already liked the cat
    if (childData.userAddresses && childData.userAddresses.includes(username)) {
      likeIcon.classList.add("liked");
    }

    likeIcon.addEventListener("click", (event) => {
      let userAddresses = childData.userAddresses || [];

      // If the user has already liked the cat, remove their username from the list of likes
      if (userAddresses.includes(username)) {
        userAddresses = userAddresses.filter((user) => user !== username);
        catRef.update({
          like: childData.like - 1,
          userAddresses: userAddresses
        });

        // Remove the "liked" class from the likeIcon
        likeIcon.classList.remove("liked");
      } else  if (userAddresses.includes(username) || !localStorage.getItem("username")) {
        // If the user has already liked the cat or their username doesn't exist in localstorage, don't do anything
        return;
      }
      else if(!userAddresses.includes(username)) {
        // Otherwise, add their username to the list of likes
        userAddresses.push(username);
        catRef.update({
          like: childData.like + 1,
          userAddresses: userAddresses
        });
       

        // Add the "liked" class to the likeIcon
        likeIcon.classList.add("liked");
      }
    });

    likes.appendChild(likeIcon);
    likes.appendChild(likeCount);
    catName.appendChild(cat);
    catName.appendChild(likes);
    catDiv.appendChild(imgElement);
    catDiv.appendChild(catName);
    imageDiv.appendChild(catDiv);
  });

  loadingPage.remove();
});




function getTopThreeCats() {
  return new Promise((resolve, reject) => {
    catModelDb
      .orderByChild("like")
      .limitToLast(3)
      .once("value")
      .then((snapshot) => {
        const cats = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          childData.key = childSnapshot.key;
          cats.push(childData);
        });
        resolve(cats.reverse());
      })
      .catch((error) => reject(error));
  }).then((cats) => {

    const firstImg = document.createElement("img");
    const secondImg = document.createElement("img");
    const thirdImg = document.createElement("img");


    const first = document.createElement("div");
    const second = document.createElement("div");
    const third = document.createElement("div");

    const topCat = document.createElement("div");
    topCat.classList.add("topCat");

    const firstName = document.createElement("p");
    const secondName = document.createElement("p");
    const thirdName = document.createElement("p");

    const firstLikes = document.createElement("p");
    const secondLikes = document.createElement("p");
    const thirdLikes = document.createElement("p");

    first.classList.add("topCats");
    second.classList.add("topCats");
    third.classList.add("topCats");

    firstName.classList.add("topLikes");
    secondName.classList.add("topLikes");
    thirdName.classList.add("topLikes");

    firstName.textContent = cats[0].name;
    secondName.textContent = cats[1].name;
    thirdName.textContent = cats[2].name;


    firstImg.src = cats[0].file;
    secondImg.src = cats[1].file;
    thirdImg.src = cats[2].file;

    firstLikes.textContent = cats[0].like;
    secondLikes.textContent = cats[1].like;
    thirdLikes.textContent = cats[2].like;


    first.appendChild(firstImg)
    first.appendChild(firstName)
    first.appendChild(firstLikes)

    second.appendChild(secondImg)
    second.appendChild(secondName)
    second.appendChild(secondLikes)

    third.appendChild(thirdImg)
    third.appendChild(thirdName)
    third.appendChild(thirdLikes)

    topCat.appendChild(first);
    topCat.appendChild(second);
    topCat.appendChild(third);

    document.querySelector(".top").appendChild(topCat);
  });
}
getTopThreeCats()






