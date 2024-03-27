import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const Subscribe = ({ content, comment }) => {
  const [comment, setComment] = useState("");

  const isFormFilled = () => comment;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <>
        <Button
          onClick={handleShow}
          variant="outline-dark"
          className="w-100 py-3"
        >
          Comments
        </Button>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>New Content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {content.comments?.map((comment, index) => (
              <div key={index}>{comment}</div>
            ))}
            <Form></Form>
            <FloatingLabel
              controlId="inputComment"
              label="Comment"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Comment"
              />
              <Button
                variant="dark"
                disabled={!isFormFilled()}
                onClick={() => {
                  comment(content.id, comment);
                  handleClose();
                }}
              >
                Add Comment
              </Button>
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

Subscribe.propTypes = {
  subscribe: PropTypes.func.isRequired,
};

export default Subscribe;
