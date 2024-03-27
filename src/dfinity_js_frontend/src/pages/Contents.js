import React from "react";
import { login } from "../utils/auth";
import Contents from "../components/contentManager/Contents";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/cover.jpg";
import { Notification } from "../components/utils/Notifications";

const ContentsPage = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <div fluid="md" className="bg-grey-800">
          <main>
            <Contents />
          </main>
        </div>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default ContentsPage;
