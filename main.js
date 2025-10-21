let books = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser tidak mendukung localStorage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
  renderBooks();
}

function renderBooks(filteredBooks = books) {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  for (const book of filteredBooks) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
      toggleBookStatus(book.id);
    });

    bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
      deleteBook(book.id);
    });

    bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
      editBook(book.id);
    });

    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  }
}

function addBook(title, author, year, isComplete) {
  const id = +new Date();
  const book = { id, title, author, year, isComplete };
  books.push(book);
  saveData();
  renderBooks();
}

function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  saveData();
  renderBooks();
}

function toggleBookStatus(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveData();
  renderBooks();
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  const newTitle = prompt('Judul baru:', book.title);
  const newAuthor = prompt('Penulis baru:', book.author);
  const newYearStr = prompt('Tahun baru:', book.year);

  if (newTitle && newAuthor && newYearStr) {
    const newYear = parseInt(newYearStr, 10);
    if (!isNaN(newYear)) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;
      saveData();
      renderBooks();
    } else {
      alert('Tahun harus berupa angka!');
    }
  }
}

function searchBook(keyword) {
  const filtered = books.filter(b => b.title.toLowerCase().includes(keyword));
  renderBooks(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist()) loadData();

  document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value, 10);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    if (!isNaN(year)) {
      addBook(title, author, year, isComplete);
      e.target.reset();
    } else {
      alert('Tahun harus berupa angka!');
    }
  });

  document.getElementById('searchBook').addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.getElementById('searchBookTitle').value.toLowerCase();
    searchBook(keyword);
  });
});
