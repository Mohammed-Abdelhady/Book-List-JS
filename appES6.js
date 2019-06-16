// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    addBookToList(book){
        const list = document.getElementById("book-list");
        // Create tr elment
        const row = document.createElement("tr");

        // Insert Columns
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <a href="#" class="delete">X</a>
        `;

        list.appendChild(row);
    }

    clearFields(){
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }

    showAlert(message, className) {
        // Create div
        const div = document.createElement('div');
        // Add Classes
        div.className = `alert ${className}`;
        // Add texxt
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get Form
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div,form);

        // Timeout after 3 sec
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === "delete") {
          target.parentElement.remove();
        }
    }
}

// Store Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book=>{
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        })
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

// Event Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get from values
    const title = document.getElementById('title').value;
          author = document.getElementById('author').value;
          isbn = document.getElementById('isbn').value;
    
    // Instansiate book 
    const book = new Book(title, author, isbn);

    // Instansiate UI
    const ui = new UI();

    if(title==='' || author==='' || isbn===''){
        ui.showAlert('Please fill in all fields', 'error');
    }else{
        // Show Added
        ui.showAlert('Book Added!', 'success');
        // Add book to list
        ui.addBookToList(book);

        // Add to Local Storage
        Store.addBook(book);

        // Clear Inputs
        ui.clearFields();
    }

    
    e.preventDefault();
});

// Event Listener for remove book
document.getElementById('book-list').addEventListener('click', function(e){
    // Instansiate UI
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);
    //Remove from LS
    Store.removeBook(e.target.previousElementSibling.textContent);

    // Show alert
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});