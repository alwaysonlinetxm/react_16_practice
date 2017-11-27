import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OC from '../../libs/oc';
import actions from '../../actions/actions';

const { getTask } = actions;

class Task extends PureComponent {
  static propTypes = {
    task: PropTypes.array,
    getTask: PropTypes.func,
    setTopbar: PropTypes.func
  }

  componentDidMount() {
    const { getTask, setTopbar } = this.props;

    getTask();
    setTopbar('task');
  }

  click = () => {
    OC.toast('lalala');
  }

  render() {
    return (
      <div onClick={ this.click }>
        { this.props.task.map((node, i) => <p key={ i } style={{ fontSize: '0.5rem' }}>{ node }</p>) }
      </div>
    );
  }
}

export default connect(state => ({
    task: state.task.task
	}),
  {
    getTask
	}
)(Task);
