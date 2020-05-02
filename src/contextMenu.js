import React, {
  useRef, useEffect, useState, useCallback
} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { registerEvent, callHideEvent } from './registerEvent';
import AnimateComponent from './animateComponent';

function ContextMenu({
  children, id, appendTo, hideOnLeave, onMouseLeave, onHide, onShow, preventHideOnScroll,
  preventHideOnResize, attributes, className, animation
}) {
  const contextMenuEl = useRef(null);
  const [isVisible, setVisible] = useState(false);
  const [clientPosition, setClientPosition] = useState(null);

  const showMenu = e => {
    const { position } = e;

    setVisible(true);
    setClientPosition(position);
  };

  const hideMenu = () => {
    setVisible(false);
    if (onHide) onHide();
  };

  const handleMouseLeave = useCallback(e => {
    e.preventDefault();

    onMouseLeave(e);

    if (hideOnLeave) callHideEvent(id);
  });

  useEffect(() => {
    registerEvent(id, showMenu, hideMenu);

    // detect click outside
    document.addEventListener('mousedown', event => {
      if (contextMenuEl.current && !contextMenuEl.current.contains(event.target)) {
        callHideEvent(id);
      }
    });

    // detect right click outside
    document.addEventListener('contextmenu', evt => {
      let targetElement = evt.target;

      do {
        if (targetElement.classList && targetElement.classList.contains('menu-trigger')) {
          return;
        }
        targetElement = targetElement.parentNode;
      }
      while (targetElement);

      callHideEvent(id);
    });

    // on scroll hide handled
    if (!preventHideOnScroll) {
      window.addEventListener('scroll', debounce(() => {
        callHideEvent(id);
      }, 300, {
        leading: true,
        trailing: false
      }));
    }

    // on resize hide handled
    if (!preventHideOnResize) {
      window.addEventListener('resize', debounce(() => {
        callHideEvent(id);
      }, 300, {
        leading: true,
        trailing: false
      }));
    }

    return () => {
      document.removeEventListener('mousedown');
      document.removeEventListener('contextmenu');
      window.removeEventListener('scroll');
      window.removeEventListener('resize');
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const { clientY, clientX } = clientPosition;
      const { innerHeight: windowInnerHeight, innerWidth: windowInnerWidth } = window;
      const { offsetHeight: elemHeight, offsetWidth: elemWidth } = contextMenuEl.current;

      let newClientY = clientY;
      let newClientX = clientX;

      if (windowInnerHeight < clientY + elemHeight) newClientY = clientY - elemHeight;
      if (windowInnerWidth < clientX + elemWidth) newClientX = clientX - elemWidth;

      contextMenuEl.current.style.top = `${newClientY + 2}px`;
      contextMenuEl.current.style.left = `${newClientX + 2}px`;

      if (onShow) onShow();
    }
  }, [isVisible, clientPosition]);

  const childrenWithProps = React.Children
    .map(children, child => React.cloneElement(child, { id }));

  const ContextComponent = () => (
    <div
      className={classnames('contextmenu', ...className.split(' '))}
      ref={contextMenuEl}
      onMouseLeave={handleMouseLeave}
      {...attributes}
    >
      {childrenWithProps}
    </div>
  );

  const PortalContextComponent = () => (
    ReactDOM.createPortal(
      <ContextComponent />,
      document.querySelector(appendTo)
    )
  );

  if (document.readyState === 'complete' && appendTo) {
    return animation ? (
      <AnimateComponent
        isVisible={isVisible}
        timeout={200}
        className={animation}
      >
        <PortalContextComponent />
      </AnimateComponent>
    ) : (
      <PortalContextComponent />
    );
  }

  return animation ? (
    <AnimateComponent
      isVisible={isVisible}
      timeout={200}
      className={animation}
    >
      <ContextComponent />
    </AnimateComponent>
  ) : <ContextComponent />;
}

export default ContextMenu;

ContextMenu.defaultProps = {
  appendTo: null,
  hideOnLeave: false,
  preventHideOnResize: false,
  preventHideOnScroll: false,
  attributes: {},
  className: '',
  animation: 'fadein',
  onMouseLeave: () => null,
  onHide: () => null,
  onShow: () => null
};
