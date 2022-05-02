import { Modal, ThemeIcon } from "@mantine/core";
import { useErrorMessage } from "./ErrorMessageContext";
import { AlertIcon } from "@primer/octicons-react";

export default function ErrorMessage() {
  const { state, closeErrorMessage } = useErrorMessage();
  return (
    <Modal
      opened={state.isErrorModalOpen}
      onClose={closeErrorMessage}
      title={
        <>
          <ThemeIcon color="red">
            <AlertIcon />
          </ThemeIcon>
          &nbsp;
          <b>{state.title}</b>
        </>
      }
    >
      {state.message}
    </Modal>
  );
}
