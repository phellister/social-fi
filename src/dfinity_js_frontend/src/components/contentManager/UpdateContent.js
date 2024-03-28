import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateContent = ({ content, save }) => {
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [cover, setCover] = useState("");
  const [subscriptionFee, setSubscriptionFee] = useState(0);
  const isFormFilled = () =>
    mediaType && cover && description && subscriptionFee;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-warning rounded-pill"
        style={{ width: "8rem" }}
      >
        <i className="bi bi-pencil-square "></i> Update
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Content</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputcover"
              label="cover"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setCover(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="mediaType"
              label="Media type"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setMediaType(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputSubscriptionFee"
              label="subscriptionFee"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="subscriptionFee"
                onChange={(e) => {
                  setSubscriptionFee(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                id: content.id,
                description,
                mediaType,
                cover,
                subscriptionFee,
              });
              handleClose();
            }}
          >
            Save content
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateContent.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateContent;
