import { React, ReactDOM, reactRouterDom, reactTransitionGroup } from "react";
(function (React, ReactDOM, reactRouterDom, reactTransitionGroup) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  class Page extends React__default['default'].Component {
    state = {};

    render() {
      return /*#__PURE__*/React__default['default'].createElement("div", null, "body");
    }

  }

  class App extends React__default['default'].Component {
    state = {};

    render() {
      return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", null, "Header"), /*#__PURE__*/React__default['default'].createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default['default'].createElement(reactRouterDom.Route //exact
      , {
        path: "/",
        render: props => /*#__PURE__*/React__default['default'].createElement(Page, props)
      })));
    }

  }

  class PathRouter extends React__default['default'].Component {
    state = {};

    render() {
      console.log("VAUMONEY:CLIENT: running html content");
      return /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.TransitionGroup, {
        key: "1"
      }, /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.CSSTransition, {
        key: "11",
        timeout: 300,
        classNames: "fade"
      }, /*#__PURE__*/React__default['default'].createElement(reactRouterDom.Route, {
        render: ({
          location,
          history
        }) => /*#__PURE__*/React__default['default'].createElement(App, {
          history: history,
          pathname: location.pathname,
          statePathname: location.state,
          location: location
        })
      })));
    }

  }

  const rootElem = document.getElementById("root");
  ReactDOM__default['default'][rootElem && rootElem.innerHTML !== "" ? "hydrate" : "render"]( /*#__PURE__*/React__default['default'].createElement(reactRouterDom.BrowserRouter, null, /*#__PURE__*/React__default['default'].createElement(PathRouter, null)), rootElem);

}(React, ReactDOM, reactRouterDom, reactTransitionGroup));
//# sourceMappingURL=scripts.js.map
