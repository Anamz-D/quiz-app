
let currentUserType = null;

// DOM Elements
const mainContent = document.getElementById('main-content');


// Event Listeners


// Initial page load
window.addEventListener('load', () => {
    renderUserTypeSelection();
});

function handleNavigation(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const page = event.target.getAttribute('data-page');
        navigateTo(page);
    }
}


function navigateTo(page) {
    switch (page) {
        case 'home':
            renderHome();
            break;
        case 'assessments':
            currentUserType === 'teacher' ? renderManageAssessments() : renderAssessmentType();
            break;

        default:
            renderHome();
    }
}

function renderUserTypeSelection() {
    const content = `
        <div class="container">
            
            <p>Please select your user type:</p>
            <button class="btn" onclick="setUserType('student')">Student</button>
            <button class="btn" onclick="setUserType('teacher')">Teacher</button>
        </div>
        <style>
            :root {
                --primary-color: #007bff;
                --dark-bg: #1a1a1a;
                --card-bg: #ffffff;
                --text-primary: #333333;
                --text-secondary: #666666;
            }

            .btn {
                display: inline-block;
                padding: 0.5rem 1rem;
                background-color: var(--primary-color);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
                border: none;
                cursor: pointer;
                font-size : 30px;
                
                
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

        </style>
    `;
    mainContent.innerHTML = content;
}

function setUserType(type) {
    currentUserType = type;
    renderHome();
}

function renderHome() {
    const content = `
        
        
        <a href="pq.html">
            <div class="feature-card">
                <img src="assets/images/menu_book.png" alt="Past Questions">
                <h3>Past Questions</h3>
                <p>Access a wide range of past questions to practice and improve your  skills</p>
            </div>
        </a>
        <a href= "assesment.html">
            <div class="feature-card">
                <img src="assets/images/check_box.png" alt="Take Assessments">
                <h3>${currentUserType === 'teacher' ? 'Set Assessments' : 'Take School Assessments'}</h3>
                <p>
                    ${currentUserType === 'teacher' ? 'Create  assessments for your students'
            : 'Challenge yourself with assessments made by your tutors'}
                    </p>
            </div>
        </a>
        <a onclick="navigateTo('assessments')">
            <div class="feature-card">
                <img src="assets/images/monitoring.png" alt="Track Progress">
                <h3>${currentUserType === 'teacher' ? 'Manage Assessments' : 'Take random assessments'}</h3>
                <p>${currentUserType === 'teacher'
            ? 'Edit and delete your created assessments'
            : 'Challenge yourself with assessments to gauge your knowledge'}</p>
            </div>
        </a>
    
        
    
    `;
    mainContent.innerHTML = content;
}

