import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../helpers/queries";

const NewBook = (props) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState(1908);
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState("");

    const [createBook] = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join("\n");
            setError(messages);
        },
    });
    console.log(error);

    if (!props.show) {
        return null;
    }

    const submit = async (event) => {
        event.preventDefault();
        createBook({ variables: { author, title, published, genres } });
        console.log("add book...");

        setTitle("");
        setPublished(1980);
        setAuthor("");
        setGenres([]);
        setGenre("");
    };

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre("");
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published}
                        onChange={({ target }) =>
                            setPublished(parseInt(target.value, 10) || 0)
                        }
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(" ")}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    );
};

export default NewBook;
