import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddArtist = ({ save }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const isFormFilled = () => userName && phone && email;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div onClick={handleShow} className="text-success-outline">
        <i className="bi bi-plus "></i> New Artist
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Artist</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Artist userName"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                placeholder="Enter userName of artist"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPhone"
              label="Phone"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Phone"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEmail"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputBio" label="Bio" className="mb-3">
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                placeholder="Bio"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputProfilePic"
              label="Profile Picture"
              className="mb-3"
            >
              <Form.Control
                text="text"
                placeholder="Image Url"
                onChange={(e) => {
                  setProfilePic(e.target.value);
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
                profilePic,
                bio,
                userName,
                phone,
                email,
              });
              handleClose();
            }}
          >
            Save artist
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddArtist.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddArtist;
