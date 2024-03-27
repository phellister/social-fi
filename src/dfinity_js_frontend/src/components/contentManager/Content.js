import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import Subscribe from "./Subscribe";
import UpdateContent from "./UpdateContent";

const Content = ({ content, subscribe, update, like }) => {
  const {
    id,
    title,
    description,
    category,
    cover,
    createdAt,
    mediaType,
    updatedAt,
    owner,
    tags,
    likes,
    comments,
    subscriptions,
    subscriptionFee,
  } = content;

  const intSubscriptionFee = Number(subscriptionFee / BigInt(10 ** 8));

  const principal = window.auth.principalText;
  const isOwnersContent = Principal.from(content.owner).toText() === principal;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(owner).toText()}
          </span>
          <div className="d-flex gap-2">
            <Badge bg="secondary" className="ms-auto">
              Fee: {intSubscriptionFee} ICP
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {likes} Likes
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {subscriptions} Subs
            </Badge>
            {isOwnersContent ? (
              <UpdateContent content={content} save={update} />
            ) : (
              <Button
                variant=""
                className="btn btn-success rounded-pill"
                style={{ width: "6rem" }}
                onClick={() => {
                  like(content.id);
                }}
              >
                Like
              </Button>
            )}
          </div>
          <div className="d-flex mt-2 flex-row justify-content-start gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} bg="secondary" className="ms-auto">
                {tag}
              </Badge>
            ))}
          </div>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={cover} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">Type: {category}</Card.Text>
          <Card.Text className="flex-grow-1 ">date: {createdAt}</Card.Text>
          <Card.Text className="flex-grow-1 ">mediaType: {mediaType}</Card.Text>
          <Card.Text className="flex-grow-1">updatedAt: {updatedAt}</Card.Text>
          <Button
            onClick={() => {
              subscribe(content.id, unitsInt);
            }}
            variant="outline-dark"
            className="w-100 py-3"
          >
            Subscribe to Content
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

Content.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
};

export default Content;
