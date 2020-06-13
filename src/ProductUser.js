import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import firebase from "./firebase/config";
import "./UAS.css";

const ProductUser = (props) => {
  const [list, setUpdate] = useState({
    show: false,
    keyProduct: props.keyProduct,
    nama: props.judul,
    kondisi: props.kondisi,
    borrowed: props.borrowed,
    story: props.story,
    uid: props.idProduct,
  });
  const [isExist, setExist] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    checkData();
  });

  const handleChange = (value, name) => {
    setUpdate({ ...list, [name]: value });
  };

  const statusAvailable = (data) => {
    if (data === "No") {
      return "Yes";
    } else {
      return "No";
    }
  };

  const showPreview = () => {
    if (isExist) {
      return props.story;
    } else {
      return truncateText(props.story);
    }
  };

  const truncateText = (str) => {
    return str.length > 10 ? str.substring(0, 150) + "..." : str;
  };

  const checkData = () => {
    firebase
      .database()
      .ref("bookProduct")
      .orderByChild("uid")
      .equalTo(props.idProduct)
      .limitToFirst(1)
      .on("child_added", (snapshot) => {
        if (snapshot.val()) {
          setExist(true);
          if (snapshot.val().acc === false) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        } else {
          setExist(false);
        }
      });
  };

  const buttonBook = () => {
    if (isExist) {
      return (
        <div className="col-md-4 col-right">
          <button
            className="button-up"
            style={{ width: "40px", padding: "3px 0px", marginRight: "10px" }}
            onClick={props.restoreBook.bind(this, {
              keyBook: props.keyBook,
              keyProduct: props.keyProduct,
            })}
            disabled={isDisabled}
          >
            <i className="fas fa-book"></i>
          </button>
          <button
            className="button-rea"
            onClick={() => handleChange(true, "show")}
            disabled={isDisabled}
          >
            <i className="fas fa-book-open"></i>
          </button>
        </div>
      );
    } else {
      return (
        <div className="col-md-4 col-right">
          <button
            className="button-up"
            style={{ width: "40px", padding: "3px 0px", marginRight: "10px" }}
            onClick={() => handleChange(true, "show")}
          >
            <i className="fas fa-book-reader"></i>
          </button>
          <button
            className="button-bok"
            onClick={props.addBook.bind(this, list)}
          >
            <i className="fas fa-bookmark"></i>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="col-md-4 item" style={{ margin: "3px 0px" }}>
      <div className="row">
        <div className="col">
          <h4 className="title label" style={{ textAlign: "left" }}>
            Title
          </h4>
        </div>
        <div className="col-md-6">
          <h4 className="title label" style={{ textAlign: "right" }}>
            Available
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h4 className="title" style={{ textAlign: "left" }}>
            {props.judul}
          </h4>
        </div>
        <div className="col-md-3">
          <h4
            className="title"
            style={{
              textAlign: "right",
              fontSize: "12px",
              letterSpacing: "3px",
            }}
          >
            {statusAvailable(props.borrowed)}
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <h4 className="title label">Condition</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h4
            className="title"
            style={{
              textAlign: "left",
              fontSize: "15px",
              letterSpacing: "3px",
            }}
          >
            {props.kondisi}
          </h4>
        </div>
        {buttonBook()}
      </div>

      <Modal show={list.show}>
        <Modal.Header style={{ display: "block", textAlign: "center" }}>
          <Modal.Title>
            <h1 className="title" style={{ letterSpacing: "10px" }}>
              {props.judul}
            </h1>
            <h4 className="title" style={{ letterSpacing: "5px" }}>
              CHAPTER 1
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ textAlign: "justify" }}>{showPreview()}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-can"
            onClick={() => handleChange(false, "show")}
          >
            Done
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductUser;
