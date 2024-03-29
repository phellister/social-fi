import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddContent = ({ save }) => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [subscriptionFee, setSubscriptionFee] = useState(0);
  const isFormFilled = () =>
    title &&
    cover &&
    mediaType &&
    category &&
    description &&
    subscriptionFee &&
    tags;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-outline-success text-white"
      >
        <i className="bi bi-plus"></i> Add Content
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Content</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputTitle"
              label="Content title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter title of content"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCategory"
              label="category"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="category"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputcover"
              label="cover"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setCover(e.target.value);
                }}
                placeholder="Enter cover url"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="mediaType"
              label="MediaType"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setMediaType(e.target.value);
                }}
                placeholder="Enter cover url"
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
            {/* tags entry to array */}
            <FloatingLabel controlId="inputTags" label="Tags" className="mb-3">
              <Form.Control
                type="text"
                placeholder="comma separated tags"
                onChange={(e) => {
                  setTags(e.target.value.split(","));
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
                title,
                cover,
                description,
                tags,
                mediaType,
                category,
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

AddContent.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddContent;
