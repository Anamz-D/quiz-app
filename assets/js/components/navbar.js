import { auth } from "../firebase.js";
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
.nav-links #teacher-link{
  display: none;
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
        <a href="/">Home</a>
        <a href="/assesment.html">Assessments</a>
        <a href="/profilepage.html">Dashboard</a>
        <a href="/sign_up.html" id="sign-up" >Sign up</a>
        <a href="/teacher" id="teacher-link" >Teacher Dash</a>
        <a href="/log_in.html" id="log-in">Login</a>
        <button id="logout-btn"> Logout </button>
    </div> 
        
</nav>
`;

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
    const teacherLink = this.shadowRoot.getElementById("teacher-link");

    let isMenuOpen = false;

    const updateAuthUI = () => {
      const userData = localStorage.getItem("user");
      const isAuthenticated = userData !== null;

      if (isAuthenticated) {
        // Parse the user data
        const user = JSON.parse(userData);

        // Hide signup/login, show logout
        signupLink.style.display = "none";
        loginLink.style.display = "none";
        logoutBtn.style.display = "inline-block";

        // Add dashboard link if user is a teacher
        if (user.role === "teacher" ) {
          teacherLink.style.display = "inline-block";
        }

      } else {
        // Show signup/login, hide logout and dashboard
        signupLink.style.display = "inline-block";
        loginLink.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }
    };

    // Initial UI update
    updateAuthUI();

    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      menuItems.style.transform = isMenuOpen ? "translatey(0)" : "translatey(-1000px)";
    }

    logoutBtn.addEventListener("click", function () {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("user");
          updateAuthUI();
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    });

    menuToggleBtn.addEventListener("click", toggleMenu);
}

}

export default NavBar;
