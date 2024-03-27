import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Artist from "./Artist";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getArtists as getArtistList,
  createArtist,
  updateArtist,
} from "../../utils/artistManager";
import { getFollowingArtists } from "../../utils/artistManager";
import { updateContent } from "../../utils/contentManager";
import AddArtist from "./AddArtist";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of artists
  const getArtists = useCallback(async () => {
    try {
      setLoading(true);
      setArtists(await getArtistList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // get following artists
  const getUserFollowingArtists = useCallback(async () => {
    try {
      setLoading(true);
      setArtists(await getFollowingArtists());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addArtist = async (data) => {
    try {
      setLoading(true);
      createArtist(data).then((resp) => {
        getArtists();
      });
      toast(<NotificationSuccess text="Artist added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a artist." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      updateArtist(data).then((resp) => {
        getArtists();
      });
      toast(<NotificationSuccess text="Artist added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a artist." />);
    } finally {
      setLoading(false);
    }
  };

  const contentUpdate = async (data) => {
    try {
      setLoading(true);
      data.subscriptionFee = parseInt(data.subscriptionFee, 10) * 10 ** 8;
      updateContent(data).then((resp) => {
        getArtists();
        toast(<NotificationSuccess text="Content update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a content." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArtists();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Artists</h1>
            <Button
              onClick={getUserFollowingArtists}
              className="btn btn-primary-outline"
            >
              Your Artists
            </Button>
            <AddArtist save={addArtist} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {artists.map((_artist, index) => (
              <Artist
                key={index}
                artist={{
                  ..._artist,
                }}
                update={update}
                updateContent={contentUpdate}
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

export default Artists;
