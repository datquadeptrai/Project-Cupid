var firebaseConfig = {
  apiKey: "AIzaSyBz6opn4PobCX_Zoh9-Dr7lS19kxy02KR8",
  authDomain: "tinder-clone-4d9c9.firebaseapp.com",
  projectId: "tinder-clone-4d9c9",
  storageBucket: "tinder-clone-4d9c9.appspot.com",
  messagingSenderId: "817387680536",
  appId: "1:817387680536:web:ba756afd60e19aa75b646d",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userRef = db.collection("users");
const auth = firebase.auth();
const dataRef = db.collection("data");
// tinder
var nameOfUser = document.getElementById("name");
var age = document.getElementById("age");
var locationOfUser = document.getElementById("location");
var gender = document.getElementById("gender");
var bio = document.querySelector(".bio");
var reject = document.querySelector(".reject");
var report = document.querySelector(".report");
var accept = document.querySelector(".accept");
var photoOfUser = document.getElementById("photoOfUser");
var profilePhoto = document.getElementById("profilePhoto");
var photoLeft = document.querySelector(".left-btn");
var photoRight = document.querySelector(".right-btn");
var dataArr = [];
var currentUser;
var list = document.querySelector(".matched");
var indexOfPhoto = 0;

if (localStorage.getItem("indexOfTinder") === null) {
  localStorage.setItem("indexOfTinder", 0);
} else {
  indexOfTinder = localStorage.getItem("indexOfTinder");
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    userRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === user.uid) {
          // if (doc.data().bioUpdated === true) {
          //   profilePhoto.src = doc.data().photoUrl;
          //   currentUser = doc.id;
          //   indexOfTinder = doc.data().indexOfTinder;
          // } else {
          //   alert("Bạn phải cập nhật thông tin trước khi sử dụng");
          //   location.href = "wall.html";
          // }
          profilePhoto.src = doc.data().photoUrl;
          currentUser = doc.id;
          matchedPeople = doc.data().matchedPeople;
          userData = doc.data();
        }
      });
    });
  } else {
    location.href = "login.html";
  }
});
function signOut() {
  location.href = "login.html";
  auth.signOut();
}

userRef.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    dataTemp = doc.data();
    dataTemp["docID"] = doc.id;
    dataArr.push(dataTemp);
  });

  var indexOfPhoto = 0;
  setTimeout(tinder, 500);
  setTimeout(checkMatch, 500);

  photoLeft.addEventListener("click", changeLeft);
  photoRight.addEventListener("click", changeRight);
  accept.addEventListener("click", acceptPerson);
  reject.addEventListener("click", rejectPerson);
  report.addEventListener("click", reportPerson);

  function acceptPerson() {
    indexOfTinder = localStorage.getItem("indexOfTinder");
    var data = dataArr[indexOfTinder];
    userRef.doc(currentUser).update({
      matchedPeople: firebase.firestore.FieldValue.arrayUnion(data.docID),
    });
    indexOfTinder++;
    localStorage.setItem("indexOfTinder", indexOfTinder);
    tinder();
    var node = document.createElement("div");
    node.setAttribute("class", "matched-people");
    node.innerHTML = `
        <img
            src="${data.profilePhoto}"
            alt=""
          />
          <span>${data.shortName}</span>
        `;
    list.append(node);
  }
  function rejectPerson() {
    var data = dataArr[indexOfTinder];
    userRef.doc(currentUser).update({
      rejectedPeople: firebase.firestore.FieldValue.arrayUnion(data.docID),
    });
    indexOfTinder++;
    localStorage.setItem("indexOfTinder", indexOfTinder);
    tinder(0);
  }
  function reportPerson() {
    var data = dataArr[indexOfTinder];
    userRef.doc(currentUser).update({
      rejectedPeople: firebase.firestore.FieldValue.arrayUnion(data.docID),
    });
    indexOfTinder++;
    localStorage.setItem("indexOfTinder", indexOfTinder);
    tinder(0);
  }
});

function changeRight() {
  var data = dataArr[indexOfTinder];
  indexOfPhoto++;
  if (indexOfPhoto === data.photoUrl.length) {
    indexOfPhoto = 0;
  }
  photoOfUser.src = data.photoUrl[indexOfPhoto];
}

function changeLeft() {
  var data = dataArr[indexOfTinder];
  if (indexOfPhoto === 0) {
    indexOfPhoto = data.photoUrl.length;
    console.log(data.photoUrl.length);
    indexOfPhoto--;
  } else {
    indexOfPhoto--;
  }
  photoOfUser.src = data.photoUrl[indexOfPhoto];
}

function checkMatch() {
  let matched = userData.matchedPeople;
  matched.forEach((element) => {
    for (i = 0; i < dataArr.length; i++) {
      if (dataArr[i].docID === element) {
        var node = document.createElement("div");
        node.setAttribute("class", "matched-people");
        node.innerHTML = `
        <img
            src="${dataArr[i].profilePhoto}"
            alt=""
          />
          <span>${dataArr[i].shortName}</span>
        `;
        list.append(node);
      }
    }
  });
}
function tinder() {
  indexOfTinder = localStorage.getItem("indexOfTinder");
  for (i = indexOfTinder; i < dataArr.length; i++) {
    if (
      (dataArr[i].bioUpdated === true &&
        matchedPeople.includes(dataArr[i].docID) === false) ||
      (dataArr[i].bioUpdated === true &&
        rejectedPeople.includes(dataArr[i].docID) === false)
    ) {
      data = dataArr[i];
      age.innerHTML = `${data.age} Tuổi`;
      nameOfUser.innerHTML = data.name;
      gender.innerHTML = data.gender;
      locationOfUser.innerHTML = data.location;
      bio.innerHTML = data.bio;
      photoOfUser.src = data.photoUrl[indexOfPhoto];
      indexOfTinder = i;
      localStorage.setItem("indexOfTinder", indexOfTinder);
      break;
    }
  }
}
