import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Content from "./Content";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getContents as getContentList,
  createContent,
  subscribe,
  updateContent,
  getFollowingContents,
  likeContent,
} from "../../utils/contentManager";
import AddContent from "./AddContent";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of contents
  const getContents = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setContents(await getContentList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get client  content
  const getUserContents = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setContents(await getFollowingContents());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addContent = async (data) => {
    console.log("adder");
    try {
      setLoading(true);
      data.availableUnits = parseInt(data.availableUnits, 10);
      data.subscriptionFee = parseInt(data.subscriptionFee, 10) * 10 ** 8;
      createContent(data).then((resp) => {
        getContents();
        toast(<NotificationSuccess text="Content added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a content." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to subscribe book
  const subscribeFunc = async (content) => {
    try {
      setLoading(true);
      subscribe(content).then((resp) => {
        getContents();
        toast(
          <NotificationSuccess text="Content subscribe successfull, check artists tab for your contents" />
        );
      });
    } catch (error) {
      console.log(
        "failed to subscribe content, check that you have enough ICP tokens"
      );
      toast(
        <NotificationError text="Failed to subscribe content. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  // like
  const like = async (content) => {
    try {
      setLoading(true);
      console.log({ content });
      likeContent(content).then((resp) => {
        getContents();
        toast(
          <NotificationSuccess text="like added successfull, check updated contents" />
        );
      });
    } catch (error) {
      toast(<NotificationError text="Failed to like content." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.subscriptionFee = parseInt(data.subscriptionFee, 10) * 10 ** 8;
      updateContent(data).then((resp) => {
        getContents();
        toast(<NotificationSuccess text="Content update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a content." />);
    } finally {
      setLoading(false);
    }
  };

  console.log(contents);

  useEffect(() => {
    getContents();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Contents</h1>
            {/* get user subscribed content */}
            <Button
              onClick={getUserContents}
              className="btn btn-primary-outline text"
            >
              Subscribed Contents
            </Button>
            <AddContent save={addContent} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {contents.map((_content, index) => (
              <Content
                key={index}
                content={{
                  ..._content,
                }}
                subscribe={subscribeFunc}
                update={update}
                like={like}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Contents;
