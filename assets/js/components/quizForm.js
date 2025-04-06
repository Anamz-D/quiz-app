class QuizForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this.template();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const title = this.shadowRoot.querySelector('#title').value.trim();
    const description = this.shadowRoot.querySelector('#description').value.trim();

    if (!title) {
      alert('Please enter a quiz title.');
      return;
    }

    const quiz = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString()
    };

    this.dispatchEvent(new CustomEvent('quiz-created', {
      detail: quiz,
      bubbles: true,
      composed: true
    }));

    // Reset form after submit
    e.target.reset();
  }

  template() {
    return /* html */`
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 400px;
        }
        label {
          font-weight: bold;
        }
        input, textarea {
          padding: 0.5rem;
          font-size: 1rem;
        }
        button {
          align-self: flex-start;
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <form>
        <div>
          <label for="title">Quiz Title</label>
          <input type="text" id="title" required />
        </div>
        <div>
          <label for="description">Description (optional)</label>
          <textarea id="description" rows="3"></textarea>
        </div>
        <button type="submit">Create Quiz</button>
      </form>
    `;
  }
}

export default QuizForm;
