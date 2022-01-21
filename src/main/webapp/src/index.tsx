import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ErrorMessageProvider } from "./ErrorMessage/ErrorMessageContext";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// import i18n (needs to be bundled ;))
import "./i18n";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>DICOOP is loading...</div>}>
      <MantineProvider
        theme={{
          primaryColor: "dark",
        }}
        styles={{
          Button: (theme) => ({
            // Shared button styles are applied to all buttons
            root: {
              padding: "0 10px",
              // backgroundColor: theme.colors.dark,
              "&:hover": {
                backgroundColor: theme.colors.dark[2],
              },
            },
          }),
        }}
      >
        <ErrorMessageProvider>
          <App />
        </ErrorMessageProvider>
      </MantineProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
