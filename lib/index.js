import KeyManagement from "./containers/keymanagement";
import keyManagerMiddleware from "./middlewares/keymanager";

import reducer from "./reducer";

export const metadata = {
  name: "key-management",
  displayName: "KeyManagement",
  author: "bPanel",
  icon: "key",
  description: require("../package.json").description,
  version: require("../package.json").version,
  sidebar: true
};

export const pluginConfig = {};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        metadata,
        Component: KeyManagement
      };

      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};

export const middleware = keyManagerMiddleware;

// we hack into reduceWallets
// until plugins get their own state space and reducers
export const reduceWallets = (state, action) => {
  if (!state.keyManager) {
    state = Object.assign({}, state, {
      keyManager: {}
    });
  }

  // hack combine reducers
  const oldState = state.keyManager;
  const newState = reducer(oldState, action);

  if (oldState !== newState)
    return Object.assign({}, state, {
      keyManager: newState
    });

  return state;
};
