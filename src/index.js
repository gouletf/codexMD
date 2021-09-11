import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";
import ErrorBoundary from "./ErrorBoundary";

import {} from "./firebase";
import { ContextProvider } from "./Context-Provider";

ReactDOM.render(
        <ErrorBoundary>
            <ContextProvider>
                <App />
            </ContextProvider>
        </ErrorBoundary>,
    document.getElementById("root")
);
