
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/styles/import_export.css';
    document.head.appendChild(link);

  
  // Usage
  function handleNavigation(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const page = event.target.getAttribute('data-page');
        navigateTo(page);
    }
}


function navigateTo(page) {
    switch (page) {
        case 'assessments':
            currentUserType === 'teacher' ? renderManageAssessments() : renderAssessmentType();
            break;

        default:
            renderHome();
    }
}

function renderManageAssessments() {
    const content = `
        <div class="container">
            <h1>Manage Assessments</h1>
            <button class="btn" onclick="renderCreateAssessment()">Create New Assessment</button>
            <div class="grid-3">
                ${mockAssessments.map(assessment => `
                    <div class="card">
                        <h2>${assessment.title}</h2>
                        <p>Number of questions: ${assessment.questions.length}</p>
                        <div class="btn-group">
                            <button class="btn" onclick="editAssessment(${assessment.id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteAssessment(${assessment.id})">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
    `;
    mainContent.innerHTML = content;
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

function handleCreateAssessment(event) {
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

    const newAssessment = { id: Date.now(), title, questions };
    mockAssessments.push(newAssessment);
    renderManageAssessments();
}

function editAssessment(id) {
    const assessment = mockAssessments.find(a => a.id === id);
    if (!assessment) return;

    const content = `
        <div class="container">
            <h1>Edit Assessment</h1>
            <form id="edit-assessment-form">
                <div class="form-group">
                    <label for="assessment-title">Assessment Title</label>
                    <input type="text" id="assessment-title" value="${assessment.title}" required>
                </div>
                <div id="questions-container">
                    ${assessment.questions.map((question, index) => `
                        <div class="card" id="question-${index}">
                            <h2>Question ${index + 1}</h2>
                            <div class="form-group">
                                <label for="question-${index}-text">Question</label>
                                <input type="text" id="question-${index}-text" value="${question.question}" required>
                            </div>
                            ${question.type === 'multiple-choice' ? `
                                <div class="form-group">
                                    <label>Options</label>
                                    ${question.options.map((option, optionIndex) => `
                                        <input type="text" value="${option}" required>
                                    `).join('')}
                                </div>
                                <div class="form-group">
                                    <label>Correct Answer</label>
                                    <select required>
                                        ${question.options.map((option, optionIndex) => `
                                            <option value="${optionIndex}" ${option === question.correctAnswer ? 'selected' : ''}>${option}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            ` : question.type === 'true-false' ? `
                                <div class="form-group">
                                    <label>Correct Answer</label>
                                    <select required>
                                        <option value="true" ${question.correctAnswer === 'true' ? 'selected' : ''}>True</option>
                                        <option value="false" ${question.correctAnswer === 'false' ? 'selected' : ''}>False</option>
                                    </select>
                                </div>
                            ` : ''}
                            <button type="button" class="btn btn-danger" onclick="removeQuestion(${index})">Remove Question</button>
                        </div>
                    `).join('')}
                </div>
                <div class="btn-group">
                    <button type="button" class="btn" onclick="addQuestion('multiple-choice')">Add Multiple Choice</button>
                    <button type="button" class="btn" onclick="addQuestion('true-false')">Add True/False</button>
                    <button type="button" class="btn" onclick="addQuestion('subjective')">Add Subjective</button>
                </div>
                <button type="submit" class="btn">Save Changes</button>
            </form>
        </div>
    `;
    mainContent.innerHTML = content;
    document.getElementById('edit-assessment-form').addEventListener('submit', (event) => handleEditAssessment(event, id));
}

function handleEditAssessment(event, id) {
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

    const assessmentIndex = mockAssessments.findIndex(a => a.id === id);
    if (assessmentIndex !== -1) {
        mockAssessments[assessmentIndex] = { ...mockAssessments[assessmentIndex], title, questions };
    }
    renderManageAssessments();
}

function deleteAssessment(id) {
    const confirmDelete = confirm('Are you sure you want to delete this assessment?');
    if (confirmDelete) {
        const assessmentIndex = mockAssessments.findIndex(a => a.id === id);
        if (assessmentIndex !== -1) {
            mockAssessments.splice(assessmentIndex, 1);
            renderManageAssessments();
        }
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

