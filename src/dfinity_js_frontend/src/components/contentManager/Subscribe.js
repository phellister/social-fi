import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const Subscribe = ({ content, subscribe, available }) => {
  const [units, setUnits] = useState("");

  const isFormFilled = () => units;

  const [show, setShow] = useState(false);

  const principal = window.auth.principalText;
  const isOwnersContent = Principal.from(content.owner).toText() === principal;

  const mediaType = content.mediaType === "true";

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {!available ? (
        <Button disabled={true} variant="outline-dark" className="w-100 py-3">
          Not available
        </Button>
      ) : !mediaType ? (
        <Button disabled={true} variant="outline-dark" className="w-100 py-3">
          Not for sale
        </Button>
      ) : isOwnersContent ? (
        <Button disabled={true} variant="outline-dark" className="w-100 py-3">
          You own the contents
        </Button>
      ) : (
        <>
          <Button
            onClick={handleShow}
            variant="outline-dark"
            className="w-100 py-3"
          >
            Subscribe to Content
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>New Content</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <FloatingLabel
                  controlId="inputUnits"
                  label="units"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setUnits(e.target.value);
                    }}
                    placeholder="Number of Units"
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
                  const unitsInt = parseInt(units, 10);
                  subscribe(content.id, unitsInt);
                  handleClose();
                }}
              >
                Subscribe Content
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

Subscribe.propTypes = {
  subscribe: PropTypes.func.isRequired,
};

export default Subscribe;
