import React, { Component } from "react";
import MainToolBar from "./MainToolBar.js";
import CardUrls from "./CardUrls.js";
import ListUrls from "./ListUrls.js";
import UrlsDialog from "./UrlsDialog.js";
import WarnDialog from "./WarnDialog.js";
import Footer from "./Footer.js";

import { connect } from "react-redux";
import { logoutUser } from "../actions";
import { myFirebase, db } from "../firebase/firebase";

import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Fab,
  LinearProgress,
  Snackbar,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import MuiAlert from "@material-ui/lab/Alert";

import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      loading: true,
      shortUrls: [],
      formopen: false,
      lurl: "",
      curl: "",
      invalidLurl: false,
      successToast: false,
      viewMode: "module",

      warnOpen: false,
      replace: false,
      editmode: false,
    };
    this.handleLurlChange = this.handleLurlChange.bind(this);
    this.handleCurlChange = this.handleCurlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLurlChange = event => {
    this.setState({ lurl: event.target.value });
  };

  handleCurlChange = event => {
    this.setState({ curl: event.target.value });
  };

  handleSubmit = async event => {
    var lurl = this.state.lurl;
    var curl = this.state.curl;
    const self = this;

    //check if the short URL exists in out shortUrls array
    let found = undefined;
    if (!this.state.editmode) {
      found = this.state.shortUrls.find(obj => obj.id === curl);
      !this.state.replace && this.setState({ warnOpen: true });
    }

    if (found === undefined || this.state.replace === true) {
      let data = {
        lurl: lurl,
        curl: curl,
      };
      let recordLength;
      await this.handleDNSProbe(lurl)
        .then(res => {
          recordLength = res;
        })
        .catch(res => this.setState({ invalidLurl: true }));

      if (recordLength > 0) {
        self.setState({ invalidLurl: false });
        db.collection("shorturls")
          .doc(curl)
          .set(data)
          .then(function () {
            self.setState({ successToast: true });
          });
        self.handleClose();
        self.updateUrls();
      } else {
        self.setState({ invalidLurl: true });
      }
    }
    this.setState({ editmode: false, replace: false });
    if (event !== undefined) {
      event.preventDefault();
    }
  };

  handleDNSProbe = url => {
    return new Promise(async (resolve, reject) => {
      let anchor = document.createElement("a");
      anchor.href = url;
      let hostname = anchor.hostname;
      console.log(hostname);
      const options = {
        method: "GET",
        url: "https://whoisapi-dns-lookup-v1.p.rapidapi.com/whoisserver/DNSService",
        params: {
          username: "username",
          password: "password",
          domainname: hostname,
          type: "A",
          outputFormat: "JSON",
        },
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_DNS_LOOKUP,
          "x-rapidapi-host": "whoisapi-dns-lookup-v1.p.rapidapi.com",
        },
      };
      console.log("start");
      let recordLength;
      try {
        const response = await axios.request(options);
        console.log(response);
        recordLength = response.data.DNSData.dnsRecords.length;
        console.log("recordLength :", recordLength);
        resolve(recordLength);
        console.log("end");
      } catch (error) {
        console.error(error);
        reject(0);
        console.log("end");
      }
    });
  };

  handleDeleteShortUrl = curl => {
    const self = this;
    db.collection("shorturls")
      .doc(curl)
      .delete()
      .then(function () {
        self.updateUrls();
      });
  };

  handleEditShortUrl = curl => {
    const self = this;
    self.setState({ editmode: true });
    var docref = db.collection("shorturls").doc(curl);
    docref
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          var data = doc.data();

          self.setState({ lurl: data.lurl });
          self.setState({ curl: data.curl });
          self.setState({ formopen: true });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  };

  handleClickOpen = () => {
    this.setState({ formopen: true });
    this.setState({ lurl: "" });
    this.setState({ curl: "" });
  };

  handleClose = () => {
    this.setState({ formopen: false });
  };

  setStatePromise = () => {
    return new Promise((resolve, reject) => {
      this.setState({ replace: true, warnOpen: false });
      resolve();
    });
  };
  closeAll = async () => {
    await this.setStatePromise();
  };

  handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ successToast: false });
  };

  updateUrls = () => {
    const self = this;
    self.setState({ loading: true });
    self.setState({ shortUrls: [] });

    db.collection("shorturls")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          self.setState({
            shortUrls: [...self.state.shortUrls, { id: doc.id, data: doc.data() }],
          });
        });
        self.setState({ loading: false });
      })
      .catch(err => {
        console.log("Error getting documents", err);
        self.setState({ loading: false });
      });
  };

  updateViewMode = mode => {
    this.setState({ viewMode: mode });
    db.collection("settings").doc("viewMode").set({ value: mode });
  };

  componentDidMount() {
    const self = this;
    myFirebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.setState({ user });
        self.updateUrls();
        var viewModeRef = db.collection("settings").doc("viewMode");
        viewModeRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No viewMode set!");
            } else {
              var data = doc.data();
              self.setState({ viewMode: data.value });
            }
          })
          .catch(err => {
            console.log("Error getting viewMode", err);
          });
      } else {
        self.setState({ user: null });
      }
    });
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                FireShort
              </Typography>
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        {this.state.loading && <LinearProgress color="secondary" />}
        <main>
          <MainToolBar state={this.state} updateViewMode={this.updateViewMode} />
          {this.state.shortUrls.length > 0 ? (
            <>
              {this.state.viewMode === "module" ? (
                <CardUrls
                  shortUrls={this.state.shortUrls}
                  handleEditShortUrl={this.handleEditShortUrl}
                  handleDeleteShortUrl={this.handleDeleteShortUrl}
                />
              ) : (
                <ListUrls
                  shortUrls={this.state.shortUrls}
                  handleEditShortUrl={this.handleEditShortUrl}
                  handleDeleteShortUrl={this.handleDeleteShortUrl}
                />
              )}
            </>
          ) : (
            <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                  Oops! Nothing here.
                </Typography>
              </Container>
            </div>
          )}

          <Fab aria-label="Add" className={classes.fab} color="primary" onClick={this.handleClickOpen}>
            <AddIcon />
          </Fab>

          <UrlsDialog
            state={this.state}
            handleClose={this.handleClose}
            handleLurlChange={this.handleLurlChange}
            handleCurlChange={this.handleCurlChange}
            handleSubmit={this.handleSubmit}
          />

          <WarnDialog
            state={this.state}
            warnClose={() => this.setState({ warnOpen: false })}
            handleSubmit={this.handleSubmit}
            closeAll={this.closeAll}
          />

          <Snackbar open={this.state.successToast} autoHideDuration={6000} onClose={this.handleToastClose}>
            <Alert onClose={this.handleToastClose} severity="success">
              Successfully added!
            </Alert>
          </Snackbar>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
  };
}

export default withStyles(styles)(connect(mapStateToProps)(Admin));
