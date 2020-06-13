import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";
import "./UAS.css";
import ProductUser from "./ProductUser";
import UAS from "./UAS";
import Login from "./Login";
import firebase from "./firebase/config";
import { Container } from "react-bootstrap";
import { AuthContext, useAuth } from "./auth/auth";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listProduct: [],
      bookProduct: [],
      authTokens: JSON.parse(localStorage.getItem("tokens")),
    };
  }

  componentDidMount = () => {
    this.ambilDataDariServerAPI();
  };

  simpanDataKeServerAPI = (path, data) => {
    firebase.database().ref(path).push(data);
  };

  handleAddBooking = (product) => {
    let bookProduct = this.state.bookProduct;
    let booking = { uid: product.uid, title: product.nama, acc: false };
    bookProduct.push({ uid: product.uid, title: product.nama, acc: false });
    this.setState({ ...this.state, bookProduct: bookProduct });
    return this.simpanDataKeServerAPI("bookProduct", booking);
  };

  handleRestoreBook = (dataProduct) => {
    firebase.database().ref("bookProduct").child(dataProduct.keyBook).remove();
    firebase
      .database()
      .ref("listProduct")
      .child(dataProduct.keyProduct)
      .update({
        borrowed: "No",
      });
    window.location.reload(false);
  };

  setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
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

  LogoutHandle = () => {
    localStorage.removeItem("tokens");
    window.location.reload(false);
  };

  LoginButton = (props) => {
    const { authTokens } = useAuth();
    const location = useLocation();
    return authTokens && location.pathname === "/admin" ? (
      <button type="submit" className="button" onClick={this.LogoutHandle}>
        LOGOUT
      </button>
    ) : location.pathname === "/login" ? (
      <Link to="/">
        <button type="submit" className="button">
          BACK HOME
        </button>
      </Link>
    ) : (
      <Link to="/login">
        <button type="submit" className="button">
          LOGIN AS ADMIN
        </button>
      </Link>
    );
  };

  PrivateRoute({ component: Component, ...rest }) {
    const { authTokens } = useAuth();

    return (
      <Route
        {...rest}
        render={(props) =>
          authTokens ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    );
  }

  HomePage = () => {
    return (
      <Container>
        <h1 className="title top">DE LIBRA RY</h1>
        <h2 className="subtitle">
          A Simple Simulator About How Library Works! Made By Wahyu. cheers!
        </h2>
        <h3 className="subtitle">List Product</h3>
        <div className="row">
          {this.state.listProduct.map((product) => {
            let keyBook = "";
            this.state.bookProduct.map((data) => {
              if (data.uid === product.uid) {
                keyBook = data.productKey;
              }
            });
            return (
              <ProductUser
                key={product.uid}
                judul={product.title}
                kondisi={product.status}
                borrowed={product.borrowed}
                story={product.story}
                keyProduct={product.productKey}
                keyBook={keyBook}
                idProduct={product.uid}
                addBook={this.handleAddBooking}
                restoreBook={this.handleRestoreBook}
              />
            );
          })}
        </div>
      </Container>
    );
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          setAuthTokens: this.setTokens,
          authTokens: this.state.authTokens,
        }}
      >
        <Router>
          <div className="row nav">
            <div className="col col-right">
              <this.LoginButton />
            </div>
          </div>
          <Switch>
            <Route path="/" exact component={this.HomePage}>
              <this.HomePage />
            </Route>
            <Route path="/login" component={Login}>
              <Login />
            </Route>
            <this.PrivateRoute path="/admin" component={UAS} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    );
  }
}
