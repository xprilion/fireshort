import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function UrlsDialog(props) {
  return (
    <Dialog open={props.state.warnOpen} onClose={props.warnClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Replace?</DialogTitle>
      <DialogContent>
          <DialogContentText>There is already a Short URL with this same name. Do you want to Replace?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.warnClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.closeAll} color="primary">
          Replace
        </Button>
      </DialogActions>
    </Dialog>
  );
}
