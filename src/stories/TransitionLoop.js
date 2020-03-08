import React from 'react';
import Lottie from '../index';
import * as animationDataA from './TwitterHeart.json';
import * as animationDataB from './beating-heart.json';

/**
 * TransitionLoop, demonstrates the use of the eventListener Props.
 * NOTE: there appears to currently be a bug in either
 * react-lottie or lottie-web which results in a chance of the loop option not
 * taking effect accross different animations.
 */
export default class TransitionLoop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTransitioned: false,
    };
  }

  clickHandler = () => {
    this.setState({ isTransitioned: false });
  };

  transition() {
    this.setState({ isTransitioned: true });
  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
    };
    const { isTransitioned } = this.state;
    const defaultOptions = {
      animationData: !isTransitioned ? animationDataA : animationDataB,
      loop: true,
      autoplay: true,
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          eventListeners={
            !isTransitioned
              ? [
                {
                  eventName: 'loopComplete',
                  callback: () => this.transition(),
                },
              ]
              : []
          }
        />
        <button type="button" style={centerStyle} onClick={this.clickHandler}>
          restart
        </button>
      </div>
    );
  }
}
