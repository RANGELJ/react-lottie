/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

const registerEvents = (anim, eventListeners) => {
  eventListeners.forEach((eventListener) => {
    anim.addEventListener(eventListener.eventName, eventListener.callback);
  });
};

const deRegisterEvents = (anim, eventListeners) => {
  eventListeners.forEach((eventListener) => {
    anim.removeEventListener(eventListener.eventName, eventListener.callback);
  });
};

const getSize = (initial) => {
  let size;

  if (typeof initial === 'number') {
    size = `${initial}px`;
  } else {
    size = initial || '100%';
  }

  return size;
};

const Lottie = ({
  options,
  eventListeners,
  isStopped,
  isPaused,
  segments,
  speed,
  direction,
  width,
  height,
  style,
  isClickToPauseDisabled,
  title,
  ariaRole,
  ariaLabel,
}) => {
  const references = useRef({
    element: undefined,
    options: undefined,
    anim: undefined,
  });

  const pause = useCallback(() => {
    const { anim } = references.current.anim;

    if (!anim) {
      return;
    }

    if (isPaused && !anim.isPaused) {
      anim.pause();
    } else if (!isPaused && anim.isPaused) {
      anim.pause();
    }
  }, [isPaused]);

  const handleClickToPause = useCallback(() => {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    const { anim } = references.current;

    if (!anim || !isClickToPauseDisabled) {
      return;
    }

    if (anim.isPaused) {
      anim.play();
    } else {
      anim.pause();
    }
  }, [isClickToPauseDisabled]);

  useEffect(() => {
    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
      optionSegments,
    } = options;

    if (!references.current.options) {
      references.current.options = {
        container: references.current.element,
        renderer: 'svg',
        loop: loop !== false,
        autoplay: autoplay !== false,
        segments: optionSegments !== false,
        animationData,
        rendererSettings,
        ...options,
      };
    } else {
      references.current.options = {
        ...references.current.options,
        ...options,
      };
    }

    const anim = lottie.loadAnimation(references.current.options);
    registerEvents(anim, eventListeners);
    references.current.anim = anim;

    return () => {
      deRegisterEvents(anim, eventListeners);
      anim.destroy();
      references.current.options.animationData = null;
      references.current.anim = null;
    };
  }, [eventListeners, options]);

  useEffect(() => {
    if (!references.current.anim) {
      return;
    }
    const { anim } = references.current;
    if (isStopped) {
      anim.stop();
    } else if (segments) {
      anim.playSegments(segments);
    } else {
      anim.play();
    }

    pause();
    anim.setSpeed(speed);
    anim.setDirection(direction);
  }, [isStopped, segments, pause, speed, direction]);

  const lottieStyles = useMemo(() => ({
    width: getSize(width),
    height: getSize(height),
    overflow: 'hidden',
    margin: '0 auto',
    outline: 'none',
    ...style,
  }));

  const handleReferenceAssignation = useCallback((newReference) => {
    references.current.element = newReference;
  }, []);

  return (
    <div
      ref={handleReferenceAssignation}
      style={lottieStyles}
      onClick={handleClickToPause}
      title={title}
      role={ariaRole}
      aria-label={ariaLabel}
      tabIndex="0"
    />
  );
};

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.shape({}),
};

Lottie.defaultProps = {
  height: undefined,
  width: undefined,
  segments: [],
  direction: undefined,
  eventListeners: [],
  style: {},
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  isClickToPauseDisabled: false,
  title: '',
};
