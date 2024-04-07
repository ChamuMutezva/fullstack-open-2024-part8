import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_YEAR_BORN, ALL_AUTHORS, ALL_BOOKS } from "../helpers/queries";

function AuthorForm(props) {
    const [name, setName] = useState("");
    const [newError, setNewError] = useState("");

    const [changeYearBorn, result] = useMutation(EDIT_YEAR_BORN, {
        refetchQueries: [
            { query: EDIT_YEAR_BORN },
            { query: ALL_AUTHORS },
            { query: ALL_BOOKS },
        ],

        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join("\n");
            setNewError(messages);
        },
    });
    console.log(result);

    const { data, loading, error } = useQuery(ALL_AUTHORS, {
        pollInterval: 2000,
    });

    console.log(data);
    const authors = data?.allAuthors;
    console.log(authors && authors[0]?.born);
    const [born, setBorn] = useState(0);
    console.log(newError);

    if (!props.show) {
        return null;
    }

    if (loading) {
        return <div>...loading</div>;
    }

    if (error || newError) {
        return <div>{error.message}</div>;
    }

    const submit = async (event) => {
        event.preventDefault();
        await changeYearBorn({ variables: { name, born } });
        setName("");
        setBorn(0);
    };

    const selectChange = async (event) => {
        console.log(event.target.value);
        setName(event.target.value);
        const author = await authors.find(
            (author) => author.name === event.target.value
        );
        console.log(author);
        setBorn(author.born);
    };

    return (
        <div>
            <h2>Set Birthyear</h2>
            <form onSubmit={submit}>
                <label>
                    <span>name</span>
                    <select name="authors" onChange={selectChange} value={name}>
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
