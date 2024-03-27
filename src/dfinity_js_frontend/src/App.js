import React, { useEffect, useCallback, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ArtistsPage from "./pages/Artists";
import ContentsPage from "./pages/Contents";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";

const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <Container fluid="md">
          <Router>
            <Nav className="d-flex align-items-center justify-content-end gap-2 pt-3 pb-5">
              <Link
                to="/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                className="text-decoration-none"
              >
                Contents page
              </Link>
              <Link
                to="/artists?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                className="text-decoration-none"
              >
                Artists page
              </Link>
              <Nav.Item>
                <Wallet
                  principal={principal}
                  balance={balance}
                  symbol={"ICP"}
                  isAuthenticated={isAuthenticated}
                  destroy={destroy}
                />
              </Nav.Item>
            </Nav>
            <main>
              <Routes>
                <Route exact path="/" element={<ContentsPage />} />
                <Route path="/artists" element={<ArtistsPage />} />
              </Routes>
            </main>
          </Router>
        </Container>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
