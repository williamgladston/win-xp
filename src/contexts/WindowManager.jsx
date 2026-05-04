import React, { createContext, useContext, useReducer, useCallback } from 'react';

const WindowManagerContext = createContext();

let nextZIndex = 100;
let nextWindowId = 1;

const initialState = {
  windows: [],
  activeWindowId: null,
};

function windowReducer(state, action) {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const existing = state.windows.find(
        w => w.appId === action.payload.appId && !action.payload.allowMultiple
      );
      if (existing) {
        return {
          ...state,
          windows: state.windows.map(w =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: ++nextZIndex }
              : w
          ),
          activeWindowId: existing.id,
        };
      }
      const newWindow = {
        id: nextWindowId++,
        appId: action.payload.appId,
        title: action.payload.title,
        icon: action.payload.icon,
        icon16: action.payload.icon16 || action.payload.icon,
        component: action.payload.component,
        props: action.payload.props || {},
        x: 80 + (state.windows.length % 8) * 30,
        y: 40 + (state.windows.length % 8) * 30,
        width: action.payload.width || 640,
        height: action.payload.height || 480,
        minWidth: action.payload.minWidth || 200,
        minHeight: action.payload.minHeight || 150,
        minimized: false,
        maximized: false,
        zIndex: ++nextZIndex,
        resizable: action.payload.resizable !== false,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
      };
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId:
          state.activeWindowId === action.payload
            ? state.windows.filter(w => w.id !== action.payload).sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null
            : state.activeWindowId,
      };
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, minimized: true } : w
        ),
        activeWindowId:
          state.activeWindowId === action.payload
            ? state.windows
                .filter(w => w.id !== action.payload && !w.minimized)
                .sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null
            : state.activeWindowId,
      };
    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload
            ? {
                ...w,
                maximized: !w.maximized,
                zIndex: ++nextZIndex,
                minimized: false,
              }
            : w
        ),
        activeWindowId: action.payload,
      };
    case 'FOCUS_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload
            ? { ...w, zIndex: ++nextZIndex, minimized: false }
            : w
        ),
        activeWindowId: action.payload,
      };
    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, x: action.payload.x, y: action.payload.y }
            : w
        ),
      };
    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? {
                ...w,
                width: Math.max(w.minWidth, action.payload.width),
                height: Math.max(w.minHeight, action.payload.height),
              }
            : w
        ),
      };
    case 'UPDATE_TITLE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, title: action.payload.title }
            : w
        ),
      };
    default:
      return state;
  }
}

export function WindowManagerProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, initialState);

  const openWindow = useCallback((config) => {
    dispatch({ type: 'OPEN_WINDOW', payload: config });
  }, []);

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: id });
  }, []);

  const minimizeWindow = useCallback((id) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id });
  }, []);

  const maximizeWindow = useCallback((id) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', payload: id });
  }, []);

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id });
  }, []);

  const moveWindow = useCallback((id, x, y) => {
    dispatch({ type: 'MOVE_WINDOW', payload: { id, x, y } });
  }, []);

  const resizeWindow = useCallback((id, width, height) => {
    dispatch({ type: 'RESIZE_WINDOW', payload: { id, width, height } });
  }, []);

  const updateTitle = useCallback((id, title) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { id, title } });
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows: state.windows,
        activeWindowId: state.activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        updateTitle,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
}
