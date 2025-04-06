class QuestionList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.questions = [];
    this.shadowRoot.innerHTML = this.template();
  }

  set data(questions) {
    this.questions = questions;
    this.renderQuestions();
  }

  template() {
    return /* html */`
        <style>
          .list {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
  
          .question-card {
            border: 1px solid #ccc;
            padding: 1rem;
            border-radius: 6px;
            background: #f9f9f9;
          }
  
          .question-title {
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
  
          .option {
            margin-left: 1rem;
          }
  
          .correct {
            color: green;
            font-weight: bold;
          }
  
          .actions {
            margin-top: 0.5rem;
            display: flex;
            gap: 0.5rem;
          }
  
          button {
            padding: 0.4rem 0.7rem;
            font-size: 0.9rem;
            cursor: pointer;
          }
  
          .edit-btn {
            background: #f0ad4e;
            border: none;
            color: white;
            border-radius: 4px;
          }
  
          .delete-btn {
            background: #d9534f;
            border: none;
            color: white;
            border-radius: 4px;
          }
        </style>
        <div class="list" id="questionList"></div>
      `;
  }

  renderQuestions() {
    const container = this.shadowRoot.querySelector("#questionList");
    container.innerHTML = "";

    if (this.questions.length === 0) {
      container.innerHTML = `<p>No questions added yet.</p>`;
      return;
    }

    this.questions.forEach((q, i) => {
      const card = document.createElement("div");
      card.className = "question-card";

      const optionsHtml = q.options
        .map((opt, idx) => {
          const isCorrect = idx === q.correctAnswer;
          return `<div class="option ${isCorrect ? "correct" : ""}">
                    ${String.fromCharCode(65 + idx)}. ${opt}
                  </div>`;
        })
        .join("");

      card.innerHTML = /* html */ `
          <div class="question-title">${i + 1}. ${q.questionText}</div>
          ${optionsHtml}
          <small>Category: ${q.category || "N/A"}, Difficulty: ${
        q.difficulty
      }</small>
          <div class="actions">
            <button class="edit-btn" data-id="${q.id}">Edit</button>
            <button class="delete-btn" data-id="${q.id}">Delete</button>
          </div>
        `;

      // Handle button clicks
      card.querySelector(".edit-btn").addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("question-edit", {
            detail: q,
            bubbles: true,
            composed: true,
          })
        );
      });

      card.querySelector(".delete-btn").addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("question-delete", {
            detail: q.id,
            bubbles: true,
            composed: true,
          })
        );
      });

      container.appendChild(card);
    });
  }
}

export default QuestionList;
