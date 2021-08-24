class Book{
    constructor(title , author , isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{

    static addBooksToTable(book){
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static clearFields(){
        const title = document.querySelector('#title');
        const author = document.querySelector('#author');
        const isbn = document.querySelector('#isbn');
        title.value = '';
        author.value = '';
        isbn.value = '';
    }

    static valid(book){
        if(book.title === '' || book.author === '' || book.isbn === ''){
            return false;
        }
        return true;
    }

    static showAlert(msg , className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div,form);
    }

    static addBook(book){
        if(UI.valid(book)){
            UI.addBooksToTable(book);
            Store.addBook(book);
            UI.showAlert('book added' , 'success');
        }
        else{
            UI.showAlert('please fill valid values in fields' , 'error')
        }

        UI.clearFields();
        setTimeout(function(){
            document.querySelector('.alert').remove();
        } , 3000);
    }

    static deleteBook(target){
        if(target.className === 'delete'){
            UI.showAlert('book removed' , 'success');
            target.parentElement.parentElement.remove();
            setTimeout(function(){
                document.querySelector('.alert').remove();
            } , 3000);
        }
    }
}

//local storage
class Store{
    //get books from db
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            UI.addBooksToTable(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books' , JSON.stringify(books));
    }

    static removeBook(isbnBook){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn === isbnBook){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books' , JSON.stringify(books));
    }
}

//DOM load event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

document.querySelector('#book-list').addEventListener('click',function(e){   
    // if(e.target.className === 'delete'){
    //     e.target.parentElement.parentElement.remove();
    // }
    //remove from ui
    UI.deleteBook(e.target);

    //remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});

document.getElementById('book-form').addEventListener('submit',function(e){
    const title = document.querySelector('#title');
    const author = document.querySelector('#author');
    const isbn = document.querySelector('#isbn');
    const book = new Book(title.value , author.value , isbn.value);

    UI.addBook(book);
    // console.log(UI);
    e.preventDefault();
});
