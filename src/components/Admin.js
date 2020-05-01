import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from "react-redux";
import { logoutUser } from "../actions";
import { myFirebase, db } from '../firebase/firebase';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  copyButton: {
    justifyContent: "flex-end",
  }
});

class Admin extends Component {
  constructor() {
    super()
		this.state = {
			user: null,
      loading: true,
      shortUrls: [],
      formopen: false,
      lurl: "",
      curl: "",
      successToast: false,
    }
    this.handleChange = this.handleLurlChange.bind(this);
    this.handleChange = this.handleCurlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleLurlChange = (event) => {
    this.setState({lurl: event.target.value});
  }

  handleCurlChange = (event) => {
    this.setState({curl: event.target.value});
  }

  handleSubmit = (event) => {
    var lurl = this.state.lurl;
    var curl = this.state.curl;
    const self = this;

    let data = {
      lurl: lurl,
      curl: curl,
    };
    
    db.collection('shorturls').doc(curl).set(data).then(function(){
      self.setState({ successToast: true});
    });

    self.handleClose();
    self.updateUrls();
    
    event.preventDefault();
  }

  handleDeleteShortUrl = (curl) => {
    const self = this;
    db.collection('shorturls').doc(curl).delete().then(function(){
      self.updateUrls();
    });
  }

  handleEditShortUrl = (curl) => {
    const self = this;
    var docref = db.collection('shorturls').doc(curl);
    docref.get().then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        var data = doc.data();

        self.setState({lurl: data.lurl});
        self.setState({curl: data.curl});
        self.setState({formopen: true});
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  handleClickOpen = () => {
    this.setState({ formopen: true});
  };

  handleClose = () => {
    this.setState({ formopen: false})
  };

  handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ successToast: false})
  };

  updateUrls = () => {
    const self = this;
    self.setState({ loading: true });
    self.setState({ shortUrls: []});

    db.collection('shorturls').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        self.setState({shortUrls: [...self.state.shortUrls, {"id": doc.id, "data": doc.data()}]});
      });
      self.setState({ loading: false });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
      self.setState({ loading: false });
    });
    
  }

  componentDidMount() {
    const self = this;
		myFirebase.auth().onAuthStateChanged(function(user) {
			if (user) {
        self.setState({ user });

        self.updateUrls();
        
			} else {
				self.setState({ user: null });
      }
		});
  };
  
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
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                FireShort
              </Typography>
              <Button color="inherit" onClick={this.handleLogout} >Logout</Button>
            </Toolbar>
          </AppBar>
        </div>
        {this.state.loading &&
          (
            <LinearProgress color="secondary" />
          )
        }
        <main>
          {this.state.shortUrls.length > 0 ?
            (
              <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                  {this.state.shortUrls.map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                          <Grid container spacing={2} direction="row-reverse">
                            <Grid item>
                              <IconButton color="primary" className={classes.copyButton} onClick={() => {navigator.clipboard.writeText(window.location.hostname + "/" + card.data.curl)}}>
                              <FileCopyOutlinedIcon />
                            </IconButton>
                            </Grid>
                          </Grid>
                          <Box bgcolor="primary.main" color="background.paper" p={2}>
                            {card.data.curl}
                          </Box>
                          <Box bgcolor="text.primary" color="background.paper" p={2} style={{overflowX: 'auto', overflowY: 'hidden', whiteSpace: "nowrap"}}>
                            {card.data.lurl}
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" href={card.data.lurl} target="_blank">
                            Open
                          </Button>
                          <Button size="small" onClick={() => this.handleEditShortUrl(card.data.curl)}>
                            Edit
                          </Button>
                          <Button size="small" color="secondary" onClick={() => this.handleDeleteShortUrl(card.data.curl)}>
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            )
            :
            (
              <div className={classes.heroContent}>
                <Container maxWidth="sm">
                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Oops! Nothing here.
                  </Typography>
                </Container>
              </div>
            )
          }

          <Fab aria-label="Add" className={classes.fab} color="primary" onClick={this.handleClickOpen}>
            <AddIcon />
          </Fab>

          <Dialog open={this.state.formopen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">FireShort URL</DialogTitle>
            <DialogContent>
              { this.state.lurl.length === 0 && this.state.curl.length === 0 && 
                (
                  <DialogContentText>
                    Enter Long and Short URLs.
                  </DialogContentText>
                )
              }
              { this.state.lurl.length === 0 && this.state.curl.length > 0 && 
                (
                  <DialogContentText>
                    Enter Long URL.
                  </DialogContentText>
                )
              }
              { this.state.lurl.length > 0 && this.state.curl.length === 0 && 
                (
                  <DialogContentText>
                    Enter Short URL.
                  </DialogContentText>
                )
              }
              { this.state.lurl.length > 0 && this.state.curl.length > 0 && 
                (
                  <DialogContentText>
                    Looks good to go!
                  </DialogContentText>
                )
              }
              <TextField
                autoFocus
                margin="dense"
                id="longurl"
                label="Long URL"
                type="url"
                fullWidth
                value={this.state.lurl} 
                onChange={this.handleLurlChange}
              />
              <TextField
                margin="dense"
                id="customurl"
                label="Custom URL"
                type="text"
                fullWidth
                value={this.state.curl} 
                onChange={this.handleCurlChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} color="primary">
                Shorten
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={this.state.successToast} autoHideDuration={6000} onClose={this.handleToastClose}>
            <Alert onClose={this.handleToastClose} severity="success">
              Successfully added!
            </Alert>
          </Snackbar>
        </main>

        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            With <span role="img" aria-label="heart">❤️</span> from <Link color="inherit" href="https://xprilion.com">
              xprilion
            </Link>
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            <Link color="inherit" href="https://github.com/xprilion/fireshort">
              Fork on GitHub
            </Link>
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError
  };
}

export default withStyles(styles)(connect(mapStateToProps)(Admin));