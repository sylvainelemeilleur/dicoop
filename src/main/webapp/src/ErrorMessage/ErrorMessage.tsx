import { Modal, ThemeIcon } from "@mantine/core";
import { ExclamationTriangleIcon } from "@modulz/radix-icons";

type ErrorMessageState = {
  isErrorModalOpen: boolean;
  title: string;
  message: string;
};

export enum ErrorMessageActionType {
  OPEN_ERROR = "openError",
  CLOSE_ERROR = "closeError",
}

type ErrorMessageAction =
  | { type: ErrorMessageActionType.OPEN_ERROR; title: string; message: string }
  | { type: ErrorMessageActionType.CLOSE_ERROR };

export function errorReducer(
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
      return {
        ...state,
        isErrorModalOpen: false,
        title: "",
        message: "",
      };
    default:
      return state;
  }
}

type ErrorMessageProps = {
  errorMessageState: ErrorMessageState;
  errorMessageDispatch: React.Dispatch<ErrorMessageAction>;
};

export default function ErrorMessage({
  errorMessageState,
  errorMessageDispatch,
}: ErrorMessageProps) {
  return (
    <Modal
      opened={errorMessageState.isErrorModalOpen}
      onClose={() =>
        errorMessageDispatch({ type: ErrorMessageActionType.CLOSE_ERROR })
      }
      title={
        <>
          <ThemeIcon color="red">
            <ExclamationTriangleIcon />
          </ThemeIcon>
          &nbsp;
          <b>{errorMessageState.title}</b>
        </>
      }
    >
      {errorMessageState.message}
    </Modal>
  );
}
