import React, { Component } from "react";
import { db } from '../firebase/firebase';
import "../config";

class Home extends Component {
  constructor (){
    super()
		this.state = {
      loc: window.location.pathname,
      newloc: ""
    }
 
    const self = this;
    console.log(self.state.loc);

    if (self.state.loc === "/"){
      self.setState({newloc: global.config.mainsite});
      window.location = global.config.mainsite;
    }
    else{
      var docid = self.state.loc.substring(1);
      var docref = db.collection('shorturls').doc(docid);
      docref.get().then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          var data = doc.data();
          self.setState({newloc: data.lurl});
          window.location = data.lurl;
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    }
  }

  render() {
    return (
      <div>
        Redirecting to <a href={ this.state.newloc } target="_blank" rel="noopener noreferrer">{this.state.newloc}</a>.
      </div>
    );
  }
}

export default Home;
