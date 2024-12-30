import NavBar from "./components/navbar.js";
import { auth } from './firebase.js';

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

window.customElements.define("nav-bar", NavBar)


function isAuthenticated(from) {
    // if ture 
    // else redirect to login 
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            localStorage.setItem("isActive", true)
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

