import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import firebase from "./firebase/config";
import "./UAS.css";

const Product = (props) => {
  const [isBorrowed, setBorrowed] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [list, setUpdate] = useState({
    show: false,
    keyProduct: props.keyProduct,
    nama: props.judul,
    kondisi: props.kondisi,
    borrowed: props.borrowed,
    story: props.story,
    uid: props.idProduct,
  });

  useEffect(() => {
    checkData();
  });

  const handleChange = (value, name) => {
    setUpdate({ ...list, [name]: value });
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
          setBorrowed(true);
          if (snapshot.val().acc === true) {
            setBorrowed(false);
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        } else {
          setBorrowed(false);
        }
      });
  };

  const buttonAcc = () => {
    if (isBorrowed) {
      return (
        <div className="col" style={{ textAlign: "center" }}>
          <button
            className="button-bok"
            onClick={props.accProduct.bind(this, {
              keyProduct: props.keyProduct,
              uid: props.idProduct,
            })}
            style={{ width: "100%", padding: "5px" }}
          >
            <i className="fas fa-book-open"></i>
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
            Status Borrowed
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
          <h4 className="title" style={{ textAlign: "right" }}>
            {props.borrowed}
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
          <h4 className="title" style={{ textAlign: "left" }}>
            {props.kondisi}
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button
            className="button-del"
            onClick={props.hapusProduct.bind(this, props.keyProduct)}
            disabled={isDisabled}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        {buttonAcc()}
        <div className="col col-right">
          <button
            className="button-up"
            onClick={() => handleChange(true, "show")}
            disabled={isDisabled}
          >
            <i className="fas fa-chevron-up"></i>
          </button>
        </div>
      </div>

      <Modal show={list.show}>
        <Modal.Header>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                onChange={(event) => handleChange(event.target.value, "nama")}
                defaultValue={props.judul}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                onChange={(event) =>
                  handleChange(event.target.value, "kondisi")
                }
                defaultValue={props.kondisi}
              >
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Very Good">Used - Very Good</option>
                <option value="Old">Old</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                onChange={(event) =>
                  handleChange(event.target.value, "borrowed")
                }
                defaultValue={props.borrowed}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="col">
              <textarea
                className="form-control"
                rows="7"
                onChange={(event) => handleChange(event.target.value, "story")}
                defaultValue={props.story}
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-can"
            onClick={() => handleChange(false, "show")}
          >
            Close
          </button>
          <button
            className="button-sav"
            onClick={props.updateProduct.bind(this, list)}
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;
