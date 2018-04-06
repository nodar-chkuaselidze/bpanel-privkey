import KeyManagement from './containers/keymanagement';
import keyDBMiddleware from './middlewares/keydb';

import reducer from './reducer';

export const metadata = {
  name: 'bpanel-privkey',
  pathName: 'key-management',
  displayName: 'Key Management',
  author: 'bPanel',
  icon: 'key',
  description: require('../package.json').description,
  version: require('../package.json').version,
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

export const middleware = keyDBMiddleware;

// we hack into reduceWallets
// until plugins get their own state space and reducers
export const reducePlugins = (state, action) => {
  // same as plugin name
  // Initial state
  if (!state.keyManagement) {
    state = Object.assign({}, state, {
      keyManagement: {}
    });
  }

  // hack combine reducers
  const oldState = state.keyManagement;
  const newState = reducer(oldState, action);

  if (oldState !== newState)
    return Object.assign({}, state, {
      keyManagement: newState
    });

  return state;
};
