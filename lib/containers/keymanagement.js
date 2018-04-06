import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header, Text } from "@bpanel/bpanel-ui";
import { connect } from "react-redux";

import KeyList from "./list";
import { openIfNotOpen } from "../actions";

export class KeyManagement extends Component {
  componentDidMount() {
    const { dispatch, manager } = this.props;
    dispatch(openIfNotOpen(manager));
  }

  get status() {
    const { open, opening, closing } = this.props.manager;

    let status = "closed";

    if (open) status = "open";
    if (opening) status = "opening";
    if (closing) status = "closing";

    return status;
  }

  render() {
    const { open } = this.props.manager;

    return (
      <div>
        <Header type="h2">Key Manager</Header>
        <Header type="h6">
          Key Manager only manages private keys and provides import/export
          functionality. It can be utilized by other plugins to sign
          transactions.
        </Header>
        <Text type="p">KeyManager is {this.status}.</Text>
        {open ? <KeyList /> : null}
      </div>
    );
  }

  static get propTypes() {
    return {
      dispatch: PropTypes.func.isRequired,
      manager: PropTypes.shape({
        open: PropTypes.bool,
        opening: PropTypes.bool,
        closing: PropTypes.bool
      })
    };
  }
}

function mapStateToProps(state) {
  const { manager } = state.plugins.keyManager;
  return { manager };
}

export default connect(mapStateToProps)(KeyManagement);
