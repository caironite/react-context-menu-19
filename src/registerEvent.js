import { uniqueId } from './helper';

const events = {};

let activeEvent = {
    id: null,
    showMenu: null,
    hideMenu: null,
    opts: null,
};

const registerEvent = (id, showMenu, hideMenu) =>
{
    const _ = uniqueId();

    events[_] = {
        id,
        showMenu,
        hideMenu
    };

    return id;
};

const callShowEvent = (opts) =>
{
    if (activeEvent.hideMenu) activeEvent.hideMenu();

    Object.keys(events).forEach((key) =>
    {
        const ev = events[key];
        if (ev.id && ev.id === opts.id)
        {
            ev.showMenu?.(opts);
            activeEvent = { ...ev, opts };
        }
    });
};

const callHideEvent = (menuId) =>
{
    if (activeEvent.id === menuId || menuId === 'ID_NOT_REQUIRED')
    {
        activeEvent.hideMenu?.();
        activeEvent = { id: null, showMenu: null, hideMenu: null, opts: null };
    }
};

const getActiveOptions = () => activeEvent.opts || {};

export
{
    registerEvent,
    callShowEvent,
    callHideEvent,
    getActiveOptions
};
