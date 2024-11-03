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
    @media (max-width: 768px) {


    .nav-links{
        flex-direction: column;
        position: absolute;
       background-color: hsl(233, 26%, 24%);
        top: 50px;
        right: 0px;
        width: 100vw;
        text-align: right;
        transform: translatex(1000px);
        transition: all .3s ;
    }
    


    button.menu-toggle {
        display: flex;
        position : absolute;
        right: 30px
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
        <a href="sign_up.html">Sign up</a>
        <a href="log_in.html">Login</a>
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

    connectedCallback(){
        const menuToggleBtn = this.shadowRoot.getElementById("menu-toggle");
        const menuItems = this.shadowRoot.querySelector(".nav-links");
        
    
        let isMenuOpen = false;


        function toggleMenu () {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen === true) {
        // menuItems.style.display = "flex";  
           menuItems.style.transform = "translatex(0)";        
            } 
            else { menuItems.style.transform = "translatex(1000px)"; }
            

        }
        menuToggleBtn.addEventListener(
        "click" , toggleMenu
        )

    }

}

export default NavBar;