document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "BOOKSHELF_APP";
  const bookForm = document.querySelector("[data-testid='bookForm']");
  const titleInput = document.querySelector("[data-testid='bookFormTitleInput']");
  const authorInput = document.querySelector("[data-testid='bookFormAuthorInput']");
  const yearInput = document.querySelector("[data-testid='bookFormYearInput']");
  const isCompleteInput = document.querySelector("[data-testid='bookFormIsCompleteCheckbox']");
  const submitButton = document.querySelector("[data-testid='bookFormSubmitButton']");

  const incompleteList = document.querySelector("[data-testid='incompleteBookList']");
  const completeList = document.querySelector("[data-testid='completeBookList']");

  const searchForm = document.querySelector("[data-testid='searchBookForm']");
  const searchInput = document.querySelector("[data-testid='searchBookFormTitleInput']");

  let books = [];

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function loadBooks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) books = JSON.parse(data);
    renderBooks();
  }
  
  function renderBooks(filteredBooks = null) {
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    const list = filteredBooks || books;
    list.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) completeList.appendChild(bookElement);
      else incompleteList.appendChild(bookElement);
    });
  }

  function createBookElement(book) {
    const container = document.createElement("div");
    container.setAttribute("data-bookid", book.id);
    container.setAttribute("data-testid", "bookItem");

    const titleEl = document.createElement("h3");
    titleEl.setAttribute("data-testid", "bookItemTitle");
    titleEl.textContent = book.title;

    const authorEl = document.createElement("p");
    authorEl.setAttribute("data-testid", "bookItemAuthor");
    authorEl.textContent = `Penulis: ${book.author}`;

    const yearEl = document.createElement("p");
    yearEl.setAttribute("data-testid", "bookItemYear");
    yearEl.textContent = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.addEventListener("click", () => {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => {
      if (confirm(`Yakin ingin menghapus "${book.title}"?`)) {
        books = books.filter((b) => b.id !== book.id);
        saveBooks();
        renderBooks();
      }
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => {
      titleInput.value = book.title;
      authorInput.value = book.author;
      yearInput.value = book.year;
      isCompleteInput.checked = book.isComplete;
      bookForm.dataset.editingId = book.id;
      submitButton.innerHTML = "Simpan Perubahan Buku";
    });

    buttonContainer.append(toggleButton, deleteButton, editButton);
    container.append(titleEl, authorEl, yearEl, buttonContainer);
    return container;
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = parseInt(yearInput.value);
    const isComplete = isCompleteInput.checked;

    if (!title || !author || !year) {
      alert("Harap isi semua data buku!");
      return;
    }

    if (bookForm.dataset.editingId) {
      const bookIndex = books.findIndex((b) => b.id === id);
      books[bookIndex] = { id, title, author, year, isComplete };
      delete bookForm.dataset.editingId;

      submitButton.innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
      alert("Perubahan buku berhasil disimpan!");
    } else {
      const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
      };
      books.push(newBook);
      alert("Buku berhasil ditambahkan!");
    }

    saveBooks();
    renderBooks();
    bookForm.reset();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = searchInput.value.toLowerCase();

    if (keyword === "") {
      renderBooks();
    } else {
      const filtered = books.filter((b) => b.title.toLowerCase().includes(keyword));
      renderBooks(filtered);
    }
  });

  loadBooks();
});
