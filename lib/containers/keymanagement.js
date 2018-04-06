import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header, Text } from "@bpanel/bpanel-ui";
import { connect } from "react-redux";

import KeyList from "./list";
import { openIfNotOpen } from "../actions";

export class KeyManagement extends Component {
  componentDidMount() {
    const { dispatch, keydb } = this.props;
    dispatch(openIfNotOpen(keydb));
  }

  get status() {
    const { open, opening, closing } = this.props.keydb;

    let status = "closed";

    if (open) status = "open";
    if (opening) status = "opening";
    if (closing) status = "closing";

    return status;
  }

  render() {
    const { open } = this.props.keydb;

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
      keydb: PropTypes.shape({
        open: PropTypes.bool,
        opening: PropTypes.bool,
        closing: PropTypes.bool
      })
    };
  }
}

function mapStateToProps(state) {
  const { keydb } = state.plugins.keyManagement;
  return { keydb };
}

export default connect(mapStateToProps)(KeyManagement);
