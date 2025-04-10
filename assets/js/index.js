import NavBar from "./components/navbar.js";
import QuestionForm from "./components/questionForm.js";
import QuestionList from "./components/questionList.js";

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// define components
window.customElements.define("nav-bar", NavBar);
window.customElements.define("question-form", QuestionForm);
window.customElements.define("question-list", QuestionList);

async function getUserData(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const localUserData = {
        uid: uid,
        email: userData.email,
        role: userData.role || "student",
        ...userData
      };
      localStorage.setItem("user", JSON.stringify(localUserData));
      return localUserData
  } else {
    throw new Error("User record not found");
  }
}

async function isAuthenticated(from = "index.html") {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        resolve(userData);
      } else {
        localStorage.removeItem("user");
        window.location.href = `/log_in.html?from=${from}`;
        reject(new Error("User not authenticated"));
      }
    });
  });
}

async function isTeacher(from = "index.html") {
  try {
    const user = await isAuthenticated(from);

    if (user.role === "teacher") {
      return user;
    } else {
      window.location.href = "/";
      throw new Error("User is not a teacher");
    }
  } catch (err) {
    throw err;
  }
}
export { isAuthenticated, isTeacher, getUserData };
