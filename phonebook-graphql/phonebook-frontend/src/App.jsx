import { useState } from "react";
import { useQuery } from "@apollo/client";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import PhoneForm from "./components/PhoneForm";
import Notify from "./components/Notify";
import { ALL_PERSONS } from "./helpers/queries";

const App = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const result = useQuery(ALL_PERSONS, {
        refetchQueries: [{ query: ALL_PERSONS }],
    });
    console.log(result);
    if (result.loading) {
        return <div>loading...</div>;
    }

    const notify = (message) => {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage(null);
        }, 10000);
    };

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <Persons persons={result.data?.allPersons} />
            <PersonForm setError={notify} />
            <PhoneForm setError={notify} />
        </div>
    );
};

export default App;
