import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../actions/actions';

import Style from './style.scss';

import logoImg from './images/logo.png';

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
      <div>
        <h1 onClick={ this.click } className={ Style.text }>{ this.props.text }</h1>
        <img src={ logoImg } className={ Style.logo } />
      </div>

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
