import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../actions/actions';
import TopBar from '../components/topbar';

// import Style from './index.scss';

const { setTopbar } = actions;

class Root extends PureComponent {
  static propTypes = {
    title: PropTypes.string
  }

  render() {
    const { title, setTopbar } = this.props;

    return (
      <div>
        <TopBar title={ title } />
        { React.cloneElement(this.props.children, { setTopbar }) }
      </div>
    );
  }
}

export default connect(state => (
  {
    title: state.topbar.title
  }),
  {
    setTopbar
  }
)(Root);
