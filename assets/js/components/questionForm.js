class QuestionForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editingQuestion = null;
    this.shadowRoot.innerHTML = this.template();
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector("form");

    form.addEventListener("submit", this.handleSubmit.bind(this));
    this.shadowRoot
      .querySelector("#cancelBtn")
      .addEventListener("click", this.cancelEdit.bind(this));
  }

  set question(q) {
    this.editingQuestion = q;

    const form = this.shadowRoot.querySelector("form");
    form.querySelector("#questionText").value = q.questionText;
    form.querySelector("#difficulty").value = q.difficulty;

    const optionInputs = form.querySelectorAll(".option-text");
    q.options.forEach((opt, i) => {
      if (optionInputs[i]) optionInputs[i].value = opt;
    });

    const radios = form.querySelectorAll('input[name="correctAnswer"]');
    radios.forEach((r) => (r.checked = false));
    if (radios[q.correctAnswer]) radios[q.correctAnswer].checked = true;

    this.updateEditUI();

    // Auto scroll into view
    this.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  updateEditUI() {
    const title = this.shadowRoot.querySelector("#formTitle");
    const submitBtn = this.shadowRoot.querySelector("#submitBtn");
    const cancelBtn = this.shadowRoot.querySelector("#cancelBtn");

    const isEditing = !!this.editingQuestion;

    title.textContent = isEditing
      ? `Editing Question (ID: ${this.editingQuestion.id})`
      : "Add New Question";

    submitBtn.textContent = isEditing ? "Save Changes" : "Add Question";
    cancelBtn.style.display = isEditing ? "inline-block" : "none";
  }

  cancelEdit() {
    const form = this.shadowRoot.querySelector("form");
    form.reset();
    this.editingQuestion = null;
    this.updateEditUI();
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = this.shadowRoot.querySelector("form");
    const questionText = form.querySelector("#questionText").value.trim();
    const options = [...form.querySelectorAll(".option-text")].map((i) =>
      i.value.trim()
    );
    const correctIndex = [
      ...form.querySelectorAll('input[name="correctAnswer"]'),
    ].findIndex((radio) => radio.checked);

    // Validation
    if (!questionText || correctIndex === -1) {
      alert("Please fill all fields and select the correct answer.");
      return;
    }

    const data = {
      id: this.editingQuestion?.id || crypto.randomUUID(),
      questionText,
      options,
      correctAnswer: correctIndex,
      difficulty: form.querySelector("#difficulty").value,
    };

    this.dispatchEvent(
      new CustomEvent(
        "question-submit",
        { detail: data, bubbles: true, composed: true }
      )
    );

    form.reset();
    this.editingQuestion = null;
    this.updateEditUI();
  }

  reset(){
    const form = this.shadowRoot.querySelector("form");
    form.reset();
  }

  template() {
    return /*html*/ `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
          max-width: 500px;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        input[type="text"], textarea, select {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
        }

        label {
          font-weight: bold;
        }

        h3 {
          margin: 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ccc;
          color: #333;
        }

        .btn-group {
          display: flex;
          gap: 0.5rem;
        }

        button {
          padding: 0.6rem 1rem;
          font-size: 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        #submitBtn {
          background: #007bff;
          color: white;
        }

        #cancelBtn {
          background: #ccc;
          color: #333;
          display: none;
        }
      </style>

      <form>
        <h3 id="formTitle">Add New Question</h3>
        
        <div>
          <label for="questionText">Question</label>
          <textarea id="questionText" required> What? </textarea>
        </div>

        <div>
          <label>Options</label>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="0" required checked>
            <input type="text" class="option-text" placeholder="Option 1" value="A" required>
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="1" required>
            <input type="text" class="option-text" placeholder="Option 2" value="B" required>
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="2" required>
            <input type="text" class="option-text" placeholder="Option 3">
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="3" required>
            <input type="text" class="option-text" placeholder="Option 4">
          </div>
        </div>

        <div>
          <label for="difficulty">Difficulty</label>
          <select id="difficulty" required>
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div class="btn-group">
          <button id="submitBtn" type="submit">Add Question</button>
          <button id="cancelBtn" type="button">Cancel</button>
        </div>
      </form>
    `;
  }
}

export default QuestionForm;
