import { auth } from '../firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


const template = document.createElement("template");
template.innerHTML = /*html*/ `

<style>
 @import "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";

 nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: hsl(233, 26%, 24%);
    color: white;
    padding: 18px 0 18px;
}

.logo {
    font-weight: bold;
    color: white;
    font-family: montserrat;
    padding-left: 30px;
    font-size: 18px;
    
}

.nav-links {
    display: flex;
}

.nav-links a {
    color: white;
    text-decoration: none;
    margin-right: 15px;
    font-size: 16px;
    padding: 5px;
}

.nav-links a:hover {
    text-decoration: underline;
}

button.menu-toggle {
    all: unset;
    display: none;

}
#logout-btn{
     all: unset;
     cursor: pointer;
     margin-right: 15px;
        font-size: 16px;
        padding: 5px; 

}
#logout-btn:hover{
    text-decoration: underline;

}
    @media (max-width: 768px) {


    .nav-links{
        flex-direction: column;
        position: absolute;
       background-color: hsl(233, 26%, 24%);
        top: 50px;
        right: 0px;
        width: 100vw;
        text-align: right;
        transform: translatey(-1000px);
        transition: all .35s ;
    }
    


    button.menu-toggle {
        display: flex;
        position : absolute;
        right: 30px
    }
    button.menu-toggle:hover{
        transform: scale(1.25)
        

    }

    #logout-btn{
      
    }
}
       
</style>

<nav>
    <span class="logo">ENCORE EDUCATION</span>
   <button id="menu-toggle" class="menu-toggle">
      <i class='bx bx-menu'></i>
    </button>
    <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="assesment.html">Assessments</a>
        <a href="sign_up.html" id="sign-up" >Sign up</a>
        <a href="log_in.html" id="log-in">Login</a>
        <button id="logout-btn"> Logout </button>
    </div> 
        
</nav>
`

class NavBar extends HTMLElement {
    constructor() {
        super();
        this.isMenuOpen = false;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const menuToggleBtn = this.shadowRoot.getElementById("menu-toggle");
        const menuItems = this.shadowRoot.querySelector(".nav-links");
        const logoutBtn = this.shadowRoot.getElementById("logout-btn");
        const signupLink = this.shadowRoot.getElementById("sign-up");
        const loginLink = this.shadowRoot.getElementById("log-in");

        let isMenuOpen = false;


        // Check authentication status and update UI
        const updateAuthUI = () => {
            const isAuthenticated = localStorage.getItem("user") !== null;

            if (isAuthenticated) {
                // User is logged in - hide signup/login, show logout
               signupLink.style.display = "none";
               loginLink.style.display = "none";
               logoutBtn.style.display = "inline-block";

                
            } else {
                // User is logged out - show signup/login, hide logout
                signupLink.style.display = "inline-block";
                loginLink.style.display = "inline-block";
                logoutBtn.style.display = "none";
            }
        }
        // Initial UI update
        updateAuthUI();

        // TODO Modify
        // if (localStorage.getItem("user")){
        //     this.shadowRoot.getElementById("sign-up").style.display = "none";
        //     this.shadowRoot.getElementById("log-in").style.display = "none";
        // }else{
        //     this.shadowRoot.getElementById("sign-up").style.display = "inline-block";
        //     this.shadowRoot.getElementById("log-in").style.display = "inline-block";
        // }


        //Toggle menu Function
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen === true) {
                // menuItems.style.display = "flex";  
                menuItems.style.transform = "translatey(0)";
            }
            else { menuItems.style.transform = "translatey(-1000px)"; }
        }
        //logout handler
        
        logoutBtn.addEventListener(
            "click", function () {
                signOut(auth).then(() => {
                    // Sign-out successful.
                    // Clear user data from localStorage
                  localStorage.removeItem("user");
                  // Update UI after logout
                   updateAuthUI();
                 // Optional: Redirect to home page
                  window.location.href = "/";

                }).catch((error) => {
                    // An error happened.
                    console.error("Logout error:", error)
                })

            }
        )
        

        menuToggleBtn.addEventListener(
            "click", toggleMenu
        )

    }

}

export default NavBar;