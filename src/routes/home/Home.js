import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../actions/actions';

const { getHomeText } = actions;

class Home extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    getHomeText: PropTypes.func,
    setTopbar: PropTypes.func
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    const { getHomeText, setTopbar } = this.props;

    getHomeText();
    setTopbar('home');
  }

  click = () => {
    console.log(this.context)
    this.context.router.push('/task');
  }

  render() {
    return (
      <div onClick={ this.click }>{ this.props.text }</div>
    );
  }
}

export default connect(state => ({
    text: state.home.text
	}),
  {
    getHomeText
	}
)(Home);
