import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

export default function UrlsDialog(props) {

    return (
        <Dialog open={props.state.formopen} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">FireShort URL</DialogTitle>
            <DialogContent>
                {props.state.lurl.length === 0 && props.state.curl.length === 0 &&
                    (
                        <DialogContentText>
                            Enter Long and Short URLs.
                        </DialogContentText>
                    )
                }
                {props.state.lurl.length === 0 && props.state.curl.length > 0 &&
                    (
                        <DialogContentText>
                            Enter Long URL.
                        </DialogContentText>
                    )
                }
                {props.state.lurl.length > 0 && props.state.curl.length === 0 &&
                    (
                        <DialogContentText>
                            Enter Short URL.
                        </DialogContentText>
                    )
                }
                {props.state.lurl.length > 0 && props.state.curl.length > 0 &&
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
                    value={props.state.lurl}
                    onChange={props.handleLurlChange}
                />
                <TextField
                    margin="dense"
                    id="customurl"
                    label="Custom URL"
                    type="text"
                    fullWidth
                    value={props.state.curl}
                    onChange={props.handleCurlChange}
                />
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