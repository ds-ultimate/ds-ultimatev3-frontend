// big chunks of that code copied from https://github.com/CW92/react-bootstrap-confirmation/blob/master/src/index.js

import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {confirmable, createConfirmation} from 'react-confirm';
import {useTranslation} from "react-i18next"

type confirmProps = {
  /** header title */
  title: string | undefined | null,
  confirmation: string, // arguments of your boostrapConfirm function
  okText: string | undefined,
  cancelText: string | undefined,
  okButtonStyle: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link',
  cancelButtonStyle: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link',
  show?: boolean, // from confirmable.
  proceed?: (result: boolean) => void, // from confirmable.
  cancel?: (tmp: any) => void, // from confirmable.
  dismiss?: () => void, // from confirmable.
};

const Confirmation = ({show, proceed, confirmation, title, okText, cancelText,
                        okButtonStyle, cancelButtonStyle}: confirmProps) => {
  const { t } = useTranslation("ui")

  if(proceed === undefined) return <></>

  const header = title ? (
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
  ) : undefined
  return (
      <Modal
          show={show}
          onHide={() => proceed(false)}
          backdrop="static"
          centered
      >
        {header}
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer>
          <Button
              variant={cancelButtonStyle}
              onClick={() => proceed(false)}
          >
            {cancelText ?? t("confirmation.cancel")}
          </Button>
          <Button
              variant={okButtonStyle}
              onClick={() => proceed(true)}
          >
            {okText ?? t("confirmation.ok")}
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

const confirmationDefaults: confirmProps = {
  title: undefined,
  confirmation: "",
  okText: undefined,
  cancelText: undefined,
  okButtonStyle: 'primary',
  cancelButtonStyle: 'secondary',
}

const confirmLow = createConfirmation(confirmable(Confirmation));

export function boostrapConfirm (message: string, options: Partial<confirmProps>={}) {
  return confirmLow({
    ...confirmationDefaults,
    ...options,
    confirmation: message,
  })
}