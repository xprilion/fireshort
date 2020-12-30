import React, {lazy, Suspense} from "react";

import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

const ProtectedRoute = lazy(()=> import("./components/ProtectedRoute"));
const Login = lazy(()=> import("./components/Login"));
const Home = lazy(()=> import("./components/Home"));
const Admin = lazy(()=> import("./components/Admin"));


function App(props) {
  const { isAuthenticated, isVerifying } = props;
  return (
    <Switch>
      <Suspense fallback={<div>Loading Page...</div>}>
        <ProtectedRoute
          exact
          path="/admin"
          component={Admin}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
      </Suspense>
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}

export default connect(mapStateToProps)(App);
