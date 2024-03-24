import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
});

const query = gql`
    query {
        allPersons {
            name
            phone
            street
            city
            id
        }
    }
`;

client.query({ query }).then((response) => {
    console.log(response.data);
});

//ReactDOM.createRoot(document.getElementById('root')).render(<App />)

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
