import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class Page extends React.Component {
  state = {};
  render() {
    return <div>body</div>;
  }
}
class App extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <div>Header</div>
        <Switch>
          <Route
            //exact
            path="/"
            render={(props) => <Page {...props} />}
          />
        </Switch>
      </div>
    );
  }
}

class PathRouter extends React.Component {
  state = {};
  render() {
    console.log("VAUMONEY:CLIENT: running html content");
    return (
      <TransitionGroup key="1">
        <CSSTransition key="11" timeout={300} classNames={"fade"}>
          <Route
            render={({ location, history }) => (
              <App
                history={history}
                pathname={location.pathname}
                statePathname={location.state}
                location={location}
              />
            )}
          />
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
const rootElem = document.getElementById("root");
ReactDOM[rootElem && rootElem.innerHTML !== "" ? "hydrate" : "render"](
  <BrowserRouter>
    <PathRouter />
  </BrowserRouter>,
  rootElem
);
