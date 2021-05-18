var firebaseConfig = {
  apiKey: "AIzaSyBz6opn4PobCX_Zoh9-Dr7lS19kxy02KR8",
  authDomain: "tinder-clone-4d9c9.firebaseapp.com",
  projectId: "tinder-clone-4d9c9",
  storageBucket: "tinder-clone-4d9c9.appspot.com",
  messagingSenderId: "817387680536",
  appId: "1:817387680536:web:ba756afd60e19aa75b646d",
};
firebase.initializeApp(firebaseConfig);

var sendButton = document.querySelector(".btnsend");
var chatbox = document.getElementById("chatbox");
var messages = document.querySelector(".messages");
var profilePhoto = document.getElementById("profilePhoto");
console.log(sendButton);
const db = firebase.firestore();
const msgRef = db.collection("msg");
const userRef = db.collection("users");
const auth = firebase.auth();
const dataRef = db.collection("data");
var list = document.querySelector(".chat-content");
var listUser = document.querySelector(".chat-people");
var currentUser;
var msgFrame = document.querySelector(".chat-topbar");
var msgContent = document.querySelector(".chat-content");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    userRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === user.uid) {
          profilePhoto.src = doc.data().photoUrl;
          currentUser = doc.id;
          indexOfTinder = doc.data().indexOfTinder;
        }
      });
      checkMatched();
    });
  } else {
    location.href = "login.html";
  }
});
function signOut() {
  location.href = "login.html";
  auth.signOut();
}
function getMsg(itemKey) {
  msgRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var sendTo = doc.data().sendTo;
      var sendFrom = doc.data().sendFrom;
      if (sendTo === currentUser && sendFrom === itemKey) {
        writeMsgTo(doc);
      }
      if (sendFrom === currentUser && sendTo === itemKey) {
        writeMsgFrom(doc);
      }
    });
  });
}
function writeMsgTo(doc) {
  var node = document.createElement("div");
  node.setAttribute("class", "chat-otherside");
  node.innerHTML = `
        <span>${doc.data().content}</span>
        `;
  list.append(node);
}
function writeMsgFrom(doc) {
  var node = document.createElement("div");
  node.setAttribute("class", "chat-you");
  node.innerHTML = `
        <span>${doc.data().content}</span>
        `;
  list.append(node);
}
function checkMatched() {
  dataRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().status == 1) {
        var node = document.createElement("div");
        node.setAttribute("class", "chat-item");
        node.setAttribute("id", doc.id);
        node.setAttribute("onclick", "checkId()");
        node.innerHTML = `
        <img
          src="${doc.data().profilePhoto}"
          alt=""
          class="chat-img"
        />
        <div class="chat-container" onclick="checkId()">
          <span class="chat-name">${doc.data().name}</span>
          <i class="fi-sr-angle-right user-arrow"></i> <br />
        </div>
        `;
        listUser.append(node);
      }
    });
  });
}
function checkId() {
  var itemKey = event.target.id;
  localStorage.setItem("itemKey", itemKey);
  dataRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.id === itemKey) {
        msgFrame.innerHTML = `
        <img
          src="${doc.data().profilePhoto}"
          alt=""
        />
        <div>
          <span class="chat-topbar-name">${doc.data().name}</span>
          <br />
        </div>
        <i class="fi-sr-info"></i>
        </div>
              `;
        msgContent.innerHTML = "";
      }
    });
  });
  getMsg(itemKey);
}
sendButton.addEventListener("click", function () {
  console.log();
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  let text = chatbox.value;
  if (chatbox.value == "") {
    alert("Ban chua nhap tin nhan");
  } else {
    var msg = {
      content: text,
      time: h + ":" + m,
      sendTo: localStorage.getItem("itemKey"),
      sendFrom: currentUser,
    };
    var node = document.createElement("div");
    node.setAttribute("class", "chat-you");
    node.innerHTML = `
        <span>${text}</span>
        `;
    list.append(node);
    msgRef.doc().set(msg, { merge: true });
    chatbox.value = "";
  }
});

// function getmessages() {
//   msgRef.on("child_added", function (snapshot) {
//     var newPost = snapshot.val();
//     var node = document.createElement("li");
//     node.setAttribute("class", "msgItems");
//     node.innerHTML = `
//     <b class="name">${newPost.user}: </b> ${newPost.content}
//     `;
//     messages.append(node);
//   });
// }
// function delHistory() {
//   msgRef.remove();
//   document.querySelector(".messages").innerHTML = "";
// }
// userRef.get().then(function (snapshot) {
//   var data = snapshot.val();
//   console.log(data);
//   const UID = auth.currentUser.uid;

//   console.log(UID);
// });
