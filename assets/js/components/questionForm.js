import { cloudName, uploadPreset } from "../cloudinary.js";

class QuestionForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editingQuestion = null;
    this.shadowRoot.innerHTML = this.template();
    this.questionImages = [];
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector("form");

    form.addEventListener("submit", this.handleSubmit.bind(this));
    this.shadowRoot
      .querySelector("#cancelBtn")
      .addEventListener("click", this.cancelEdit.bind(this));
    this.setupUploadButtons();
    this.setupQuestionImageUpload();
  }

  set question(q) {
    this.editingQuestion = q;
    this.questionImages = q.questionImages || [];

    const form = this.shadowRoot.querySelector("form");
    form.querySelector("#questionText").value = q.questionText;

    const previews = this.shadowRoot.querySelectorAll(".preview");

    // Set the question images
    this.renderQuestionImages();


    const optionInputs = form.querySelectorAll(".option-text");
    q.options.forEach((opt, i) => {
      if (optionInputs[i]) optionInputs[i].value = opt;

      // Check if the value is an image URL
      if (opt.startsWith("http")) {
        previews[i].src = opt;
        previews[i].style.display = "inline-block";
      } else {
        console.log("Not an image URL:", opt);
        previews[i].style.display = "none";
        previews[i].src = "";
      }
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
    this.reset();
    this.updateEditUI();
  }

  setupUploadButtons() {
    const buttons = this.shadowRoot.querySelectorAll(".upload-btn:not(#questionImageUploadBtn)");
    const inputs = this.shadowRoot.querySelectorAll(".option-text");
    const previews = this.shadowRoot.querySelectorAll(".preview");

    let currentIndex = null;

    // Create the widget
    const widget = cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ["local", "url", "camera"],
        multiple: false,
      },
      (error, result) => {
        if (!error && result.event === "success" && currentIndex !== null) {
          const url = result.info.secure_url;

          inputs[currentIndex].value = url;
          previews[currentIndex].src = url;
          previews[currentIndex].style.display = "inline-block";
        }
      }
    );

    // Attach click listeners to each button
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        currentIndex = i;
        widget.open();
      });
    });
  }
  setupQuestionImageUpload() {
    const uploadBtn = this.shadowRoot.querySelector("#questionImageUploadBtn");
  
    const widget = cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ["local", "url", "camera"],
        multiple: false,
      },
      (error, result) => {
        if (!error && result.event === "success") {
          const url = result.info.secure_url;
          this.questionImages.push(url);
          this.renderQuestionImages();
        }
      }
    );
  
    uploadBtn.addEventListener("click", () => {
      widget.open();
    });
  }
  
  renderQuestionImages() {
    const container = this.shadowRoot.querySelector("#questionImageContainer");
    container.innerHTML = "";
    this.questionImages.forEach((url, i) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <img src="${url}" class="big-img" />
        <span class="remove" data-index="${i}">✖</span>
      `;
      container.appendChild(wrapper);
    });
  
    container.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        this.questionImages.splice(index, 1);
        this.renderQuestionImages();
      });
    });
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
      questionImages: this.questionImages,
      questionText,
      options,
      correctAnswer: correctIndex,
    };

    this.dispatchEvent(
      new CustomEvent("question-submit", {
        detail: data,
        bubbles: true,
        composed: true,
      })
    );

    this.reset();
    this.editingQuestion = null;
    this.updateEditUI();
  }

  reset() {
    const form = this.shadowRoot.querySelector("form");
    form.reset();
    this.editingQuestion = null;

    const previews = form.querySelectorAll(".preview");
    previews.forEach((img) => {
      img.src = "";
      img.style.display = "none";
    });
    this.questionImages = [];
    this.renderQuestionImages();    
    this.updateEditUI();
  }

  template() {
    return /*html*/ `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 3rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
        
          
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

        .preview {
          max-height: 30px;
          margin-left: 0.5rem;
          vertical-align: middle;
          display: none;
        }
        .upload-btn {
          background: #eee;
          padding: 0.2rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .image-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .image-container img {
          max-height: 40px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .image-container .remove {
          cursor: pointer;
          font-size: 0.8rem;
          color: red;
        }
        img .big-img {
          height: 100px;
          width: 100px;
          border-radius: 4px;
        }


      </style>

      <form>
        <h3 id="formTitle">Add New Question</h3>
        
        <div>
          <label for="questionText">Question</label>
          <textarea id="questionText" required></textarea>
        </div>
      
        <div>
          <label>Attach Images (Optional)</label>
          <div id="questionImageContainer" class="image-container"></div>
          <button type="button" id="questionImageUploadBtn" class="upload-btn">Upload Image 📷</button>
        </div>
      
        <div>
          <label>Options</label>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="0" required checked>
            <input type="text" class="option-text" placeholder="Option 1" value="A" required>
            <button type="button" class="upload-btn">📷</button>
            <img class="preview" style="max-height: 30px; max-width:40px; display: none;" />
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="1" required>
            <input type="text" class="option-text" placeholder="Option 2" value="B" required>
            <button type="button" class="upload-btn">📷</button>
            <img class="preview" style="max-height: 30px; max-width:40px; display: none;" />
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="2" required>
            <input type="text" class="option-text" placeholder="Option 3">
            <button type="button" class="upload-btn">📷</button>
            <img class="preview" style="max-height: 30px; max-width:40px; display: none;" />
          </div>
          <div class="option-row">
            <input type="radio" name="correctAnswer" value="3" required>
            <input type="text" class="option-text" placeholder="Option 4">
            <button type="button" class="upload-btn">📷</button>
            <img class="preview" style="max-height: 30px; max-width:40px; display: none;" />
          </div>
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
