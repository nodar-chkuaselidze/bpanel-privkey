import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from '@bpanel/bpanel-ui';

import { NONE, LOADED, UNLOCKED } from '../keydb/status';

const statusMessages = {
  [NONE]: 'Not loaded',
  [LOADED]: 'Loaded',
  [UNLOCKED]: 'Unlocked'
};

export class KeyList extends Component {
  render() {
    const { list } = this.props;
    const headers = ['#', 'name', 'status'];
    const tableData = list.map(k => {
      return {
        '#': k.index,
        status: statusMessages[k.status],
        name: k.name
      };
    });

    return (
      <div>
        <Table
          headerHeight={30}
          rowHeight={30}
          colHeaders={headers}
          tableData={tableData}
        />
      </div>
    );
  }

  static get propTypes() {
    return {
      list: PropTypes.arrayOf(
        PropTypes.shape({
          index: PropTypes.number,
          name: PropTypes.string,
          status: PropTypes.oneOf([NONE, LOADED, UNLOCKED])
        })
      )
    };
  }
}

function mapStateToProps(state) {
  const { list } = state.plugins.keyManagement;

  return { list };
}

export default connect(mapStateToProps)(KeyList);
