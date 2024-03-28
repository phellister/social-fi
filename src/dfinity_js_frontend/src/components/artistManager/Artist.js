import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import UpdateArtist from "./UpdateArtist";
import { Principal } from "@dfinity/principal";
import UpdateContent from "../contentManager/UpdateContent";

const Artist = ({ artist, update, updateContent, follow }) => {
  const {
    id,
    userName,
    followers,
    email,
    phone,
    principal,
    profilePic,
    contents,
  } = artist;

  const artistPrincipal = window.auth.principalText;
  const sameOwner = Principal.from(principal).toText() === artistPrincipal;

  console.log(artist);

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-start">
          <Stack className="d-flex flex-row justify-content-between align-items-center gap-2">
            {/* small profile picture */}
            <img
              src={profilePic}
              alt={userName}
              className="img-circle"
              style={{ objectFit: "cover" }}
              width="80"
              height="80"
            />
            <Card.Title>Name: {userName}</Card.Title>
            {sameOwner ? (
              <UpdateArtist artist={artist} save={update} />
            ) : (
              <Button
                className="btn btn-outline-success text-white"
                onClick={() => {
                  follow(artist.id);
                }}
              >
                Follow
              </Button>
            )}
          </Stack>
          <Badge bg="secondary" className="ms-auto">
            {Number(followers)} Followers
          </Badge>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">Phone: {phone}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            Principal: {Principal.from(principal).toText()}
          </Card.Text>
          <h3>Artist contents</h3>
          {contents.map((content, index) => {
            const intSubscriptionFee = Number(
              content.subscriptionFee / BigInt(10 ** 8)
            );

            return (
              <Card key={index} className="flex-grow-1 w-40">
                <Card.Header>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="secondary" className="ms-auto">
                      price: {intSubscriptionFee} ICP
                    </Badge>
                    <Badge bg="secondary" className="ms-auto">
                      {Number(content.likes)} Likes
                    </Badge>
                    {sameOwner && (
                      <UpdateContent content={content} save={updateContent} />
                    )}
                  </Stack>
                </Card.Header>
                <Card.Body className="d-flex  flex-column">
                  <Card.Title>{content.title}</Card.Title>
                  <Card.Text className="flex-grow-1 ">
                    description: {content.description}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    Type: {content.category}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    date: {content.createdAt}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    Subs: {Number(content.subscriptions)}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    Tags:
                    {content.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="ms-auto">
                        {tag}
                      </Badge>
                    ))}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </Card.Body>
      </Card>
    </Col>
  );
};

Artist.propTypes = {
  artist: PropTypes.instanceOf(Object).isRequired,
};

export default Artist;
