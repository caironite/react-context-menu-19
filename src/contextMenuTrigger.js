import React, { useRef, useCallback } from 'react';
import classnames from 'classnames';
import { callShowEvent, callHideEvent } from './registerEvent';

const ContextMenuTrigger = ({
    children,
    id,
    disableWhileShiftPressed = false,
    attributes = {},
    disable = false,
    className = '',
    as: Component = 'div',
    data = null
}) =>
{
    const menuTrigger = useRef(null);

    const handleContextMenu = useCallback(e =>
    {
        if (disable)
        {
            return;
        }

        if (disableWhileShiftPressed && e.nativeEvent.shiftKey)
        {
            callHideEvent(id);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { clientX, clientY } = e.nativeEvent;

        const opts = {
            position: {
                clientY,
                clientX
            },
            id,
            data
        };

        callShowEvent(opts);

    }, [disable, disableWhileShiftPressed, id, data]);

    return (
        <Component
            className={ classnames('menu-trigger', ...className.split(' ')) }
            ref={ menuTrigger }
            { ...attributes }
            onContextMenu={ handleContextMenu }
        >
            { children }
        </Component>
    );
}

export default ContextMenuTrigger;
