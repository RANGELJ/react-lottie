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
import lottie, {
  AnimationItem,
  AnimationEventName,
  AnimationEventCallback,
  AnimationDirection,
  SVGRendererConfig,
  CanvasRendererConfig,
  HTMLRendererConfig,
  AnimationSegment,
  AnimationConfigWithPath,
  AnimationConfigWithData,
} from 'lottie-web';

type AnimationConfigProp = {
  renderer?: 'svg' | 'canvas' | 'html';
  loop?: boolean | number;
  autoplay?: boolean;
  name?: string;
  assetsPath?: string;
  animationData?: any; // eslint-disable-line
  rendererSettings?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig;
}

interface AnimEventListener {
  eventName: AnimationEventName;
  callback: AnimationEventCallback;
}

const registerEvents = (anim: AnimationItem, eventListeners: AnimEventListener[]): void => {
  eventListeners.forEach((eventListener) => {
    anim.addEventListener(eventListener.eventName, eventListener.callback);
  });
};

const deRegisterEvents = (anim: AnimationItem, eventListeners: AnimEventListener[]): void => {
  eventListeners.forEach((eventListener) => {
    anim.removeEventListener(eventListener.eventName, eventListener.callback);
  });
};

const getSize = (initial: number | string | undefined): string => {
  let size;

  if (typeof initial === 'number') {
    size = `${initial}px`;
  } else {
    size = initial || '100%';
  }

  return size;
};

interface LottieProps {
  options: AnimationConfigProp;
  eventListeners?: AnimEventListener[];
  isStopped?: boolean;
  isPaused?: boolean;
  segments?: AnimationSegment[];
  speed?: number;
  direction?: AnimationDirection;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  isClickToPauseDisabled?: boolean;
  title?: string;
  ariaRole?: string;
  ariaLabel?: string;
}

interface LottieReferences {
  element?: HTMLDivElement;
  anim?: AnimationItem;
  options?: (AnimationConfigWithPath | AnimationConfigWithData) & {
    animationData?: any; // eslint-disable-line
  };
}

const Lottie: React.FunctionComponent<LottieProps> = ({
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
  const references = useRef<LottieReferences>({
    element: undefined,
    options: undefined,
    anim: undefined,
  });

  const pause = useCallback(() => {
    const { anim } = references.current;

    if (!anim) {
      return;
    }

    if (isPaused) {
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

    if (isPaused) {
      anim.play();
    } else {
      anim.pause();
    }
  }, [isClickToPauseDisabled, isPaused]);

  useEffect(() => {
    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
    } = options;

    if (!references.current.element) {
      return (): void => {
        // nothing
      };
    }

    if (!references.current.options) {
      references.current.options = {
        container: references.current.element,
        renderer: 'svg',
        loop: loop !== false,
        autoplay: autoplay !== false,
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
    if (eventListeners) {
      registerEvents(anim, eventListeners);
    }
    references.current.anim = anim;

    return (): void => {
      if (eventListeners) {
        deRegisterEvents(anim, eventListeners);
      }
      anim.destroy();
      if (references.current.options) {
        references.current.options.animationData = undefined;
      }
      references.current.anim = undefined;
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
    if (speed) {
      anim.setSpeed(speed);
    }
    if (direction) {
      anim.setDirection(direction);
    }
  }, [isStopped, segments, pause, speed, direction]);

  const lottieStyles = useMemo(() => ({
    width: getSize(width),
    height: getSize(height),
    overflow: 'hidden',
    margin: '0 auto',
    outline: 'none',
    ...style,
  }), [style]);

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
      tabIndex={0}
    />
  );
};

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.shape({
    eventName: PropTypes.oneOf<AnimationEventName>([
      'enterFrame',
      'loopComplete',
      'complete',
      'segmentStart',
      'destroy',
      'config_ready',
      'data_ready',
      'DOMLoaded',
      'error',
      'data_failed',
      'loaded_images',
    ]).isRequired,
    callback: PropTypes.func.isRequired,
  }).isRequired),
  options: PropTypes.shape({
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    optionSegments: PropTypes.bool,
    animationData: PropTypes.any,
    rendererSettings: PropTypes.oneOfType([
      PropTypes.shape({
        imagePreserveAspectRatio: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        preserveAspectRatio: PropTypes.string,
        progressiveLoad: PropTypes.bool,
        hideOnTransparent: PropTypes.bool,
        viewBoxOnly: PropTypes.bool,
        viewBoxSize: PropTypes.string,
        focusable: PropTypes.bool,
      }),
      PropTypes.shape({
        imagePreserveAspectRatio: PropTypes.string,
        className: PropTypes.string,
        clearCanvas: PropTypes.bool,
        context: PropTypes.any,
        progressiveLoad: PropTypes.bool,
        preserveAspectRatio: PropTypes.string,
      }),
      PropTypes.shape({
        imagePreserveAspectRatio: PropTypes.string,
        className: PropTypes.string,
        hideOnTransparent: PropTypes.bool,
      }),
    ]),
  }).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf<[number, number]>(
    PropTypes.arrayOf(
      PropTypes.number.isRequired,
    ).isRequired as PropTypes.Validator<[number, number]>,
  ),
  direction: PropTypes.oneOf([1, -1]),
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
  direction: 1,
  eventListeners: undefined,
  style: {},
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  isClickToPauseDisabled: false,
  title: '',
};

export default Lottie;
