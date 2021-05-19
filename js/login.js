var firebaseConfig = {
  apiKey: "AIzaSyBz6opn4PobCX_Zoh9-Dr7lS19kxy02KR8",
  authDomain: "https://datquadeptrai.github.io/Project-Cupid",
  projectId: "tinder-clone-4d9c9",
  storageBucket: "tinder-clone-4d9c9.appspot.com",
  messagingSenderId: "817387680536",
  appId: "1:817387680536:web:ba756afd60e19aa75b646d",
};
firebase.initializeApp(firebaseConfig);

var signIn = document.getElementById("googleSignIn");
var signIn2 = document.getElementById("facebookSignIn");
var email = document.querySelector(".email");
var password = document.querySelector(".password");
var signIn3 = document.querySelector(".login-submit");

const db = firebase.firestore();
const userRef = db.collection("users");
const auth = firebase.auth();

signIn.addEventListener("click", signInWithGoogle);
signIn2.addEventListener("click", signInWithFacebook);
signIn3.addEventListener("click", signInWithEmailAndPassword);

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      userRef
        .doc(auth.currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            location.href = "index.html";
          } else {
            let user = {
              displayName: auth.currentUser.displayName,
              UID: auth.currentUser.uid,
              photoUrl: auth.currentUser.photoURL,
              bioUpdated: false,
              matchedPeople: [],
              rejectedPeople: [],
            };
            userRef
              .doc(auth.currentUser.uid)
              .set(user, { merge: true })
              .then(() => {
                location.href = "index.html";
              });
          }
        });
    })
    .catch(function (error) {
      var errorCode = error.code;
      if (errorCode) {
        alert("Đăng nhập thất bại");
      }
    });
}
function signInWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log(auth.currentUser);
    })
    .catch(function (error) {
      var errorCode = error.code;
      if (errorCode) {
        alert("Đăng nhập thất bại");
      }
    });
}
function signInWithEmailAndPassword() {
  if (email.value == "" && password.value == "") {
    alert("Bạn chưa điền email hoặc mật khẩu");
  } else {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        var user = userCredential.user;
        userRef
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              location.href = "index.html";
            } else {
              let user = {
                UID: auth.currentUser.uid,
                bioUpdated: false,
              };
              userRef
                .doc(auth.currentUser.uid)
                .set(user, { merge: true })
                .then(() => {
                  location.href = "index.html";
                });
            }
          });
      })
      .catch(function (error) {
        var errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          alert("Bạn đã nhập sai mật khẩu");
          password.style.border = "1px solid red";
        }
        if (errorCode === "auth/invalid-email") {
          alert("Bạn đã nhập sai Email");
          email.style.border = "1px solid red";
        }
        if (errorCode === "auth/user-not-found") {
          alert("Tài khoản không tồn tại");
          email.style.border = "1px solid red";
          password.style.border = "1px solid red";
        }
      });
  }
}
function signUpWithEmailAndPassword() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      var user = userCredential.user;
    });
}
