import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./UAS.css";
import { Container } from "react-bootstrap";
import { useAuth } from "./auth/auth";

export default function Login() {
  const { authTokens } = useAuth();
  const { setAuthTokens } = useAuth();
  const [list, setUpdate] = useState({ pass: "" });

  const handleChange = (value) => {
    setUpdate({ pass: value });
  };

  const handleLogin = () => {
    let pass = list.pass;
    if (pass === "root") {
      setAuthTokens({ admin: true });
      window.location.reload(false);
    }
  };

  if (authTokens) {
    return <Redirect to="/admin" />;
  }

  return (
    <Container>
      <h1 className="title" style={{ marginTop: "150px" }}>
        LOGIN PAGE
      </h1>
      <h2 className="subtitle" style={{ paddingBottom: "10px" }}>
        Hello Admin, What's your password?
      </h2>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder=". . . . ?"
              onChange={(event) => handleChange(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <button type="submit" className="button" onClick={handleLogin}>
          PROCEED
        </button>
      </div>
    </Container>
  );
}
