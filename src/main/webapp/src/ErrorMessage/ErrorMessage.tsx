import { Modal, ThemeIcon } from "@mantine/core";
import { ExclamationTriangleIcon } from "@modulz/radix-icons";
import { useErrorMessage } from "./ErrorMessageContext";

export default function ErrorMessage() {
  const { state, closeErrorMessage } = useErrorMessage();
  return (
    <Modal
      opened={state.isErrorModalOpen}
      onClose={closeErrorMessage}
      title={
        <>
          <ThemeIcon color="red">
            <ExclamationTriangleIcon />
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
