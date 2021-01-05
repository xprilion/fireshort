import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
//import { LocalPrintshopSharp } from '@material-ui/icons';
   
const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(2),
    },
  }));
  
export default function UrlsDialog(props) {
    const classes = useStyles(); 
    const [gurl,setGurl]=useState("");  
    function makeid() {
        var length = 10;
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        setGurl(result);
    } 
    function forgetid() {
        setGurl("");
        props.handleClear();
    }
    return (
        <Dialog open={props.state.formopen} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">FireShort URL</DialogTitle>
            <DialogContent>
                {props.state.lurl.length === 0 && props.state.curl.length === 0 &&  gurl.length ===0  &&
                    (
                        <DialogContentText>
                            Enter Long and Short URLs.
                        </DialogContentText>
                    )
                }
                 {props.state.lurl.length === 0 && (props.state.curl.length > 0  || gurl.length > 0 )&&
                    (
                        <DialogContentText>
                            Enter Long URL.
                        </DialogContentText>
                    )
                }
                {props.state.lurl.length > 0 && (props.state.curl.length === 0  &&  gurl.length === 0) &&
                    (
                        <DialogContentText>
                            Enter or Generate Short URL.
                        </DialogContentText>
                    )
                }
                 {props.state.lurl.length > 0 && (props.state.curl.length > 0 ||  gurl.length>0) &&
                    (
                        <DialogContentText>
                            Looks good to go!
                        </DialogContentText>
                    )
                }
                {props.state.lurl.length > 0 &&(props.state.curl.length > 0 ||  gurl.length>0) &&  props.state.invalidLurl &&
                    (
                        <DialogContentText style={{color:'red'}}>
                            Invalid Long URL! Please try again.
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
                    value={props.state.lurl}
                    onChange={props.handleLurlChange}
                />
                <TextField
                    margin="dense"
                    id="customurl"
                    label="Custom URL"
                    type="text"
                    value={gurl.length>0?gurl:props.state.curl}
                    onChange={props.handleCurlChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick = {makeid}
                >
                 Generate
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    onClick={forgetid}
                    startIcon={<DeleteIcon />}
                   
                >Clear 
                </Button>
                </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
              </Button>
                <Button onClick={props.handleSubmit} color="primary">
                    Shorten
              </Button>
            </DialogActions>
        </Dialog>
    );
}
