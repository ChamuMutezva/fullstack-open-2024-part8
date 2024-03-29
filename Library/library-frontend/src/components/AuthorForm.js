import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_YEAR_BORN, ALL_AUTHORS, ALL_BOOKS } from "../helpers/queries";

function AuthorForm(props) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const [changeYearBorn] = useMutation(EDIT_YEAR_BORN, {
        refetchQueries: [
            { query: EDIT_YEAR_BORN },
            { query: ALL_AUTHORS },
            { query: ALL_BOOKS },
        ],
        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join("\n");
            setError(messages);
        },
    });

    const result = useQuery(ALL_AUTHORS, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    const authors = result.data?.allAuthors;
    const initialBornYear = authors && authors[0].born;
    console.log(authors && authors[0].born);
    const [born, setBorn] = useState(initialBornYear);
    console.log(error);

    if (!props.show) {
        return null;
    }

    const submit = async (event) => {
        event.preventDefault();

        changeYearBorn({ variables: { name, born } });
        setName("");
        setBorn(1980);
    };

    const onChange = async (event) => {
        console.log(event.target.value);

        setName(event.target.value);
        const author = await authors.find(
            (author) => author.name === event.target.value
        );
        console.log(author);
        setBorn(author.born || "");
    };

    return (
        <div>
            <h2>Set Birthyear</h2>
            <form onSubmit={submit}>
                <label>
                    name
                    <select name="authors" value={name} onChange={onChange}>
                        {authors?.map((author) => {
                            return (
                                <option key={author.name} value={author.name}>
                                    {author.name}
                                </option>
                            );
                        })}
                    </select>
                </label>

                <div>
                    <label htmlFor="year_born">Born</label>
                    <input
                        type="number"
                        value={born}
                        id="year_born"
                        onChange={({ target }) =>
                            setBorn(parseInt(target.value, 10) || 0)
                        }
                    />
                </div>
                <button type="submit">Edit year born</button>
            </form>
        </div>
    );
}

export default AuthorForm;
