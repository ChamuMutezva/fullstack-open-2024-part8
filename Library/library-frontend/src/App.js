import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import AuthorForm from "./components/AuthorForm";

const App = () => {
    const [page, setPage] = useState("authors");
    return (
        <div>
            <div>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>
                <button onClick={() => setPage("add")}>add book</button>
                <button onClick={() => setPage("editAuthor")}>
                    edit year born
                </button>
            </div>

            <Authors show={page === "authors"} />
            <Books show={page === "books"} />
            <NewBook show={page === "add"} />
            <AuthorForm show={page === "editAuthor"} />
        </div>
    );
};

export default App;
