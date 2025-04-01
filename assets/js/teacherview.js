<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import { collection ,doc, addDoc ,getDoc, getDocs , setDoc , updateDoc, deleteDoc , Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {  db } from '/assets/js/firebase.js';
const mainContent = document.getElementById("main-content");
>>>>>>> Stashed changes
=======
const mainContent = document.getElementById("main-content");
>>>>>>> 6a2b340159cecfd1cebe9c596153ea7c505c3f25

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './assets/styles/import_export.css';
document.head.appendChild(link);

  
<<<<<<< HEAD
<<<<<<< Updated upstream
  // Usage
  
=======

function renderTeacherView(callback) {
=======

function renderTeacherView(callback) {
   const content = `

    <a href="pq.html">
        <div class="feature-card">
            <img src="./assets/images/menu_book.png" alt="Past Questions">
            <h3>Past Questions</h3>
            <p>Access a wide range/array of pq's  to take questions from</p>
        </div>
    </a>
    <a id="create-assessments">
        <div class="feature-card">
            <img src="./assets/images/1106.jpg" alt="">
            <h3>Create Aseesments</h3>
            <p>Make comprehensive assesments for your students</p>
        </div>
    </a>
    <a href="" id="manage-assessments" >
        <div class="feature-card">
            <img src="./assets/images/monitoring.png" alt="Track Progress" >
            <h3>Manange assessments</h3>
            <p> edit and delete assesments from the database </p>
        </div>
    </a>   
   
   `;
    mainContent.innerHTML = content;
    if (callback) {
        callback();
    }
}

function renderManageAssessments() {
>>>>>>> 6a2b340159cecfd1cebe9c596153ea7c505c3f25
    const content = `
 
     <a href="pq.html">
         <div class="feature-card">
             <img src="./assets/images/menu_book.png" alt="Past Questions">
             <h3>Past Questions</h3>
             <p>Access a wide range/array of pq's  to take questions from</p>
         </div>
     </a>
     <a id="create-assessments">
         <div class="feature-card">
             <img src="./assets/images/1106.jpg" alt="">
             <h3>Create Aseesments</h3>
             <p>Make comprehensive assesments for your students</p>
         </div>
     </a>
     <a href="" id="manage-assessments" >
         <div class="feature-card">
             <img src="./assets/images/monitoring.png" alt="Track Progress" >
             <h3>Manange assessments</h3>
             <p> edit and delete assesments from the database </p>
         </div>
     </a>   
    
    `;
     mainContent.innerHTML = content;
     if (callback) {
         callback();
     }
 }


>>>>>>> Stashed changes
function renderManageAssessments() {
    const assessmentsCollection = collection(db, 'assessments');
    getDocs(assessmentsCollection)
      .then((querySnapshot) => {
            const assessments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const content = `
                <div class="container">
                    <h1>Manage Assessments</h1>
                    <button class="btn" onclick="renderCreateAssessment()">Create New Assessment</button>
                    <div class="grid-3">
                        ${assessments.map(assessment => `
                            <div class="card">
                                <h2>${assessment.title}</h2>
                                <p>Number of questions: ${assessment.questions.length}</p>
                                <div class="btn-group">
                                    <button class="btn edit btn" data-id="editAssessment(${assessment.id})">Edit</button>
                                    <button class="btn btn-danger delete-btn" data-id="deleteAssessment(${assessment.id})">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            mainContent.innerHTML = content;

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    deleteAssessment(Id);
                });
            });
            
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    editAssessment(Id);
                });
            });
                
        })
      .catch((error) => {   
         console.error('Error retrieving assessments:', error);
            
      });
}

function renderCreateAssessment() {
    const content = `
        <div class="container">
            <h1>Create New Assessment</h1>
            <form id="create-assessment-form">
                <div class="form-group">
                    <label for="assessment-title">Assessment Title</label>
                    <input type="text" id="assessment-title" required>
                </div>
                <div id="questions-container"></div>
                <div class="btn-group">
                    <button type="button" class="btn" onclick="addQuestion('multiple-choice')">Add Multiple Choice</button>
                    <button type="button" class="btn" onclick="addQuestion('true-false')">Add True/False</button>
                    <button type="button" class="btn" onclick="addQuestion('subjective')">Add Subjective</button>
                </div>
                <button type="submit" class="btn">Create Assessment</button>
            </form>
            <a href="./teacher.html"><button class="btn">Cancel</button></a>
        </div>
    `;
    mainContent.innerHTML = content;
    document.getElementById('create-assessment-form').addEventListener('submit', handleCreateAssessment);
}

function addQuestion(type) {
    const questionsContainer = document.getElementById('questions-container');
    const questionId = Date.now();
    const questionHtml = `
        <div class="card" id="question-${questionId}">
            <h2>New Question</h2>
            <div class="form-group">
                <label for="question-${questionId}-text">Question</label>
                <input type="text" id="question-${questionId}-text" required>
            </div>
            ${type === 'multiple-choice' ? `
                <div class="form-group">
                    <label>Options</label>
                    <input type="text" placeholder="Option 1" required>
                    <input type="text" placeholder="Option 2" required>
                    <input type="text" placeholder="Option 3" required>
                    <input type="text" placeholder="Option 4" required>
                </div>
                <div class="form-group">
                    <label>Correct Answer</label>
                    <select required>
                        <option value="0">Option 1</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                    </select>
                </div>
            ` : type === 'true-false' ? `
                <div class="form-group">
                    <label>Correct Answer</label>
                    <select required>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            ` : ''}
            <button type="button" class="btn btn-danger" onclick="removeQuestion(${questionId})">Remove Question</button>
        </div>
    `;
    questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
}

function removeQuestion(questionId) {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
        questionElement.remove();
    }
}

async function handleCreateAssessment(event) {
    event.preventDefault();
    const title = document.getElementById('assessment-title').value;
    const questions = Array.from(document.getElementById('questions-container').children).map(questionElement => {
        const questionText = questionElement.querySelector('input[type="text"]').value;
        const questionType = questionElement.querySelector('select') ? 
            (questionElement.querySelectorAll('input[type="text"]').length > 1 ? 'multiple-choice' : 'true-false') : 
            'subjective';
        
        let options, correctAnswer;
        if (questionType === 'multiple-choice') {
            options = Array.from(questionElement.querySelectorAll('input[type="text"]')).slice(1).map(input => input.value);
            correctAnswer = options[parseInt(questionElement.querySelector('select').value)];
        } else if (questionType === 'true-false') {
            correctAnswer = questionElement.querySelector('select').value;
        }

        return { question: questionText, type: questionType, options, correctAnswer };
    });

    // const newAssessment = { id: Date.now(), title, questions };
    // mockAssessments.push(newAssessment);
    // renderManageAssessments();
    const newAssessment = { title, questions, createdAt: Timestamp.now() };
    try {
        await addDoc(collection(db, 'assessments'), newAssessment);
        renderManageAssessments();
    } catch (error) {
        console.error('Error creating assessment:', error);
    }
}

async function deleteAssessment(id) {
    if (confirm('Are you sure you want to delete this assessment?')) {
        try {
            // Extract the assessment ID from the data-id attribute
            const assessmentId = id.match(/deleteAssessment\((.*?)\)/)[1];
            if (!assessmentId) {
                throw new Error('Could not extract assessment ID from data-id attribute');
            }
            
            await deleteDoc(doc(db, 'assessments', assessmentId));
            renderManageAssessments();
        } catch (error) {
            console.error('Error deleting assessment:', error);
            alert('Failed to delete assessment. Please try again.');
        }
    }
}


async function editAssessment(id) {
    const assessmentRef = doc(db, 'assessments', id);
    const docSnap = await getDoc(assessmentRef);
    
    if (docSnap.exists()) {
        const assessment = { id: docSnap.id, ...docSnap.data() };
        
        const content = `
            <div class="container">
                <h1>Edit Assessment</h1>
                <form id="edit-assessment-form">
                    <div class="form-group">
                        <label for="assessment-title">Assessment Title</label>
                        <input type="text" id="assessment-title" value="${assessment.title}" required>
                    </div>
                    <div id="questions-container">
                        ${assessment.questions.map(question => `
                            <div class="card" id="question-${question._id || Date.now()}">
                                <h2>Question</h2>
                                <div class="form-group">
                                    <label for="question-${question._id}-text">Question</label>
                                    <input type="text" id="question-${question._id}-text" value="${question.question}" required>
                                </div>
                                ${question.type === 'multiple-choice' ? `
                                    <div class="form-group">
                                        <label>Options</label>
                                        ${question.options.map((option, index) => `
                                            <input type="text" value="${option}" required>
                                        `).join('')}
                                    </div>
                                    <div class="form-group">
                                        <label>Correct Answer</label>
                                        <select required>
                                            ${question.options.map((option, index) => `
                                                <option value="${index}" ${index === question.options.indexOf(question.correctAnswer) ? 'selected' : ''}>
                                                    Option ${index + 1}
                                                </option>
                                            `).join('')}
                                        </select>
                                    </div>
                                ` : question.type === 'true-false' ? `
                                    <div class="form-group">
                                        <label>Correct Answer</label>
                                        <select required>
                                            <option value="true" ${question.correctAnswer === 'true' ? 'selected' : ''}>
                                                True
                                            </option>
                                            <option value="false" ${question.correctAnswer === 'false' ? 'selected' : ''}>
                                                False
                                            </option>
                                        </select>
                                    </div>
                                ` : ''}
                                <button type="button" class="btn btn-danger" onclick="removeQuestion('${question._id || Date.now()}')">Remove Question</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn" onclick="addQuestion('multiple-choice')">Add Multiple Choice</button>
                        <button type="button" class="btn" onclick="addQuestion('true-false')">Add True/False</button>
                        <button type="button" class="btn" onclick="addQuestion('subjective')">Add Subjective</button>
                    </div>
                    <button type="submit" class="btn">Update Assessment</button>
                    <button type="button" class="btn" onclick="renderManageAssessments()">Cancel</button>
                </form>
            </div>
        `;
        
        mainContent.innerHTML = content;
        document.getElementById('edit-assessment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleUpdateAssessment(e, id);
        });
    }
}


async function handleUpdateAssessment(event, id) {
    event.preventDefault();
    const title = document.getElementById('assessment-title').value;
    const questions = Array.from(document.getElementById('questions-container').children).map(questionElement => {
        const questionText = questionElement.querySelector('input[type="text"]').value;
        const questionType = questionElement.querySelector('select') ? 
            (questionElement.querySelectorAll('input[type="text"]').length > 1 ? 'multiple-choice' : 'true-false') : 
            'subjective';
        
        let options, correctAnswer;
        if (questionType === 'multiple-choice') {
            options = Array.from(questionElement.querySelectorAll('input[type="text"]')).slice(1).map(input => input.value);
            correctAnswer = options[parseInt(questionElement.querySelector('select').value)];
        } else if (questionType === 'true-false') {
            correctAnswer = questionElement.querySelector('select').value;
        }

        return { question: questionText, type: questionType, options, correctAnswer };
    });

    try {
        await updateDoc(doc(db, 'assessments', id), {
            title,
            questions: questions,
            updatedAt: Timestamp.now()
        });
        renderManageAssessments();
    } catch (error) {
        console.error('Error updating assessment:', error);
    }
}


let mockAssessments = [
    {
        id: 1,
        title: 'Math Quiz',
        questions: [
            { question: 'What is 2 + 2?', type: 'multiple-choice', options: ['3', '4', '5', '6'], correctAnswer: '4' },
            { question: 'Is 5 a prime number?', type: 'true-false', correctAnswer: 'true' },
            { question: 'Explain the concept of division.', type: 'subjective' }
        ]
    },
    {
        id: 2,
        title: 'Science Quiz',
        questions: [
            { question: 'What is the chemical symbol for water?', type: 'multiple-choice', options: ['H2O', 'CO2', 'NaCl', 'O2'], correctAnswer: 'H2O' },
            { question: 'The Earth is flat.', type: 'true-false', correctAnswer: 'false' },
            { question: 'Describe the process of photosynthesis.', type: 'subjective' }
        ]
    }
];

window.addEventListener('load', function(){
    if (window.location.pathname === '/teacher.html') {
        renderTeacherView(function(){

            const manageAssessments = document.getElementById('manage-assessments');
            manageAssessments.addEventListener('click', function(event) {
                
                event.preventDefault();
                renderManageAssessments();

            });
            const createAssessments = document.getElementById('create-assessments');
            createAssessments.addEventListener('click', function(event) {
                
                event.preventDefault();
                renderCreateAssessment();

            });

        });
    }
   
});

// Make the function globally accessible
window.renderCreateAssessment = renderCreateAssessment;
window.addQuestion = addQuestion;
window.removeQuestion = removeQuestion;
window.editAssessment = editAssessment;
window.deleteAssessment = deleteAssessment;