import React from 'react';
import { Modal } from 'react-bootstrap';
import ButtonView from './ButtonView';

export default function ModalView({
  showModal,
  setShowModal,
  modalTitle,
  modalBody,
  action2Text,
  action2Color,
  action2Loading,
  action2Function,
}) {
  return (
    <Modal
      show={showModal}
      backdrop='static'
      keyboard={false}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            fontSize: '1.3rem',
          }}
        >
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          fontSize: '0.9rem',
        }}
      >
        {modalBody}
      </Modal.Body>
      <Modal.Footer>
        {action2Text && (
          <ButtonView
            variant={action2Color}
            isLoading={action2Loading}
            onClick={() => {
              action2Function();
              setShowModal(false);
            }}
          >
            {action2Text}
          </ButtonView>
        )}
        <ButtonView variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </ButtonView>
      </Modal.Footer>
    </Modal>
  );
}
