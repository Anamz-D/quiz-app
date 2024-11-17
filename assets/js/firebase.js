// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// TODO: Add SDKs from firbase js librarys for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAx5s54LcfGV5r03TFqaetGB1Fho9UaAjI",
    authDomain: "encore-assessment.firebaseapp.com",
    projectId: "encore-assessment",
    storageBucket: "encore-assessment.firebasestorage.app",
    messagingSenderId: "341199945900",
    appId: "1:341199945900:web:485c468f5e69de68a19f09",
    measurementId: "G-C9XNW3LCEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, analytics, auth};
