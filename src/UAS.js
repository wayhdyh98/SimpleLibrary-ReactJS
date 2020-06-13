import React, { Component } from "react";
import "./UAS.css";
import Product from "./Product";
import firebase from "./firebase/config";
import { Container } from "react-bootstrap";

export default class UAS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listProduct: [],
      bookProduct: [],
    };
  }

  componentDidMount = () => {
    this.ambilDataDariServerAPI();
  };

  ambilDataDariServerAPI = () => {
    let ref = firebase.database().ref("listProduct");
    ref.on("value", (snapshot) => {
      const listProduct = [];
      snapshot.forEach((snap) => {
        let array = snap.val();
        array["productKey"] = snap.key;
        listProduct.push(array);
        this.setState({ listProduct: listProduct });
      });
    });

    let ref2 = firebase.database().ref("bookProduct");
    ref2.on("value", (snapshot) => {
      const bookProduct = [];
      snapshot.forEach((snap) => {
        let array = snap.val();
        array["productKey"] = snap.key;
        bookProduct.push(array);
        this.setState({ bookProduct: bookProduct });
      });
    });
  };

  simpanDataKeServerAPI = (path, data) => {
    firebase.database().ref(path).push(data);
  };

  handleHapusProduct = (keyProduct) => {
    firebase.database().ref("listProduct").child(keyProduct).remove();
  };

  handleUpdatesProduct = (product) => {
    firebase.database().ref("listProduct").child(product.keyProduct).update({
      title: product.nama,
      status: product.kondisi,
      borrowed: product.borrowed,
      story: product.story,
    });
  };

  handleAccProduct = (dataProduct) => {
    let keyBook = "";
    this.state.bookProduct.map((data) => {
      if (data.uid === dataProduct.uid) {
        keyBook = data.productKey;
      }
    });
    firebase.database().ref("bookProduct").child(keyBook).update({
      acc: true,
    });
    firebase
      .database()
      .ref("listProduct")
      .child(dataProduct.keyProduct)
      .update({
        borrowed: "Yes",
      });
  };

  handleTombolSimpan = (event) => {
    let title = this.refs.namaProduk.value;
    let status = this.refs.kondisi.value;
    let borrowed = this.refs.borrowed.value;
    let story = this.refs.story.value;

    if (title && status && borrowed && story) {
      const uid = new Date().getTime().toString();
      const listProduct = this.state.listProduct;
      const product = { uid, title, status, borrowed, story };
      listProduct.push({ uid, title, status, borrowed, story });
      this.setState({ listProduct: listProduct });
      this.simpanDataKeServerAPI("listProduct/", product);
    }

    this.refs.namaProduk.value = "";
    this.refs.kondisi.value = "";
    this.refs.borrowed.value = "";
    this.refs.story.value = "";
  };

  render() {
    return (
      <Container>
        <h1 className="title">Welcome, Admin</h1>
        <h2 className="subtitle">Please fill this form to Add New Data</h2>
        <div className="row">
          <div className="col">
            <div className="form-group row">
              <label htmlFor="nama" className="col-sm-3 col-form-label">
                Title
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="nama"
                  ref="namaProduk"
                  required
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group row">
              <label htmlFor="kondisi" className="col-sm-3 col-form-label">
                Status
              </label>
              <div className="col-sm-9">
                <select className="form-control" ref="kondisi" required>
                  <option value="New">New</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Very Good">Used - Very Good</option>
                  <option value="Old">Old</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group row">
              <label htmlFor="stok" className="col-sm-4 col-form-label">
                Borrowed?
              </label>
              <div className="col-sm-8">
                <select className="form-control" ref="borrowed" required>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col">
            <input type="hidden" name="uid" ref="uid" />
            <button
              type="submit"
              className="button"
              onClick={this.handleTombolSimpan}
            >
              Add
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            <div className="form-group">
              <label htmlFor="isi">Story</label>
              <textarea
                className="form-control"
                rows="7"
                ref="story"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <h3 className="subtitle">List Product</h3>
        <div className="row">
          {this.state.listProduct.map((product) => {
            return (
              <Product
                key={product.uid}
                judul={product.title}
                kondisi={product.status}
                borrowed={product.borrowed}
                story={product.story}
                idProduct={product.uid}
                keyProduct={product.productKey}
                hapusProduct={this.handleHapusProduct}
                updateProduct={this.handleUpdatesProduct}
                accProduct={this.handleAccProduct}
              />
            );
          })}
        </div>
      </Container>
    );
  }
}
