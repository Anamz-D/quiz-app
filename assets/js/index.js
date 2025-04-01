import NavBar from "./components/navbar.js";
import { auth } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

window.customElements.define("nav-bar", NavBar)


function isAuthenticated(from) {
    // if ture 
    // else redirect to login 
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            localStorage.setItem("isActive", true)
            
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const role = userData.role;

                if (role === "teacher") {
                    window.location.href = "/teacher.html";
                } else if (role === "student") {
                    // Do nothing, stay on index.html
                }
            }
            // ...
        } else {
            // User is signed out
            // ...   
            localStorage.setItem("isActive", false)
            window.location.href = `/log_in.html?from=assesment.html`;
            // window.location.href = `/log_in.html?from=${from}`; //For dynamic router To work on every page 
        }
    });
}

export default isAuthenticated;

