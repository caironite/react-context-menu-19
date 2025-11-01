import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { callHideEvent, getActiveOptions } from './registerEvent';

const ContextMenuItem = ({
    children,
    onClick = () => null,
    disabled = false,
    preventClose = false,
    attributes = {},
    className = ''
}) =>
{
    const contextMenuItem = useRef(null);

    const handleClickEvent = useCallback(e =>
    {
        if (disabled)
        {
            return;
        }

        const ctx = getActiveOptions();
        onClick(e, ctx);

        if (!preventClose)
        {
            callHideEvent('ID_NOT_REQUIRED');
        }

    }, [disabled, preventClose, onClick]);

    return (
        <div
            className={
                classnames(
                    'contextmenu__item',
                    {
                        'contextmenu__item--disabled': disabled
                    },
                    ...className.split(' ')
                )
            }
            onClick={ handleClickEvent }
            { ...attributes }
            ref={ contextMenuItem }
        >
            { children }
        </div>
    );
}

export default ContextMenuItem;
