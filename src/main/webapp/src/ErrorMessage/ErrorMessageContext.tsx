import { createContext, useContext, useReducer } from "react";

type ErrorMessageState = {
  isErrorModalOpen: boolean;
  title: string;
  message: string;
};

enum ErrorMessageActionType {
  OPEN_ERROR = "openError",
  CLOSE_ERROR = "closeError",
}

type ErrorMessageAction =
  | { type: ErrorMessageActionType.OPEN_ERROR; title: string; message: string }
  | { type: ErrorMessageActionType.CLOSE_ERROR };

function errorReducer(
  state: ErrorMessageState,
  action: ErrorMessageAction
): ErrorMessageState {
  switch (action.type) {
    case ErrorMessageActionType.OPEN_ERROR:
      return {
        ...state,
        isErrorModalOpen: true,
        title: action.title,
        message: action.message,
      };
    case ErrorMessageActionType.CLOSE_ERROR:
      return defaultState;
    default:
      return state;
  }
}

interface ErrorMessageContextProps {
  state: ErrorMessageState;
  dispatch: React.Dispatch<ErrorMessageAction>;
}

const ErrorMessageContext = createContext<ErrorMessageContextProps | null>(
  null
);

const defaultState = {
  isErrorModalOpen: false,
  title: "",
  message: "",
};

const ErrorMessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, defaultState);
  const value = { state, dispatch };
  return (
    <ErrorMessageContext.Provider value={value}>
      {children}
    </ErrorMessageContext.Provider>
  );
};

const useErrorMessage = () => {
  const context = useContext(ErrorMessageContext);
  if (context === undefined) {
    throw new Error(
      "useErrorMessage must be used within a ErrorMessageProvider"
    );
  }
  const showErrorMessage = (title: string, message: string) => {
    context?.dispatch({
      type: ErrorMessageActionType.OPEN_ERROR,
      title,
      message,
    });
  };
  const closeErrorMessage = () =>
    context?.dispatch({ type: ErrorMessageActionType.CLOSE_ERROR });
  return {
    state: context?.state ?? defaultState,
    showErrorMessage,
    closeErrorMessage,
  };
};

export { ErrorMessageProvider, useErrorMessage };
