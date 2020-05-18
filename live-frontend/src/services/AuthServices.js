import { getLocalData, setLocalData } from "./StoreServices";

const _store = {
  state: {
    accessToken: getLocalData("accessToken", ""),
    refreshToken: getLocalData("refreshToken", ""),
    user: getLocalData("user", {})
  },
  subscribers: []
};

const _broadcast = () => {
  setTimeout(() => {
    _store.subscribers.forEach(subscriber => {
      subscriber(_store.state);
    });
  });
};

export const notifyUpdate = _broadcast;

export const subscribe = subscriber => {
  if (typeof subscriber !== "function") return;
  if (_store.subscribers.indexOf(subscriber) !== -1) return;

  _store.subscribers = [].concat(_store.subscribers, subscriber);
};

export const unsubscribe = subscriber => {
  _store.subscribers = _store.subscribers.filter(sub => sub !== subscriber);
};

export const isAuthenticated = () => {
  const { state } = _store;
  return !!state.accessToken;
};

export const setUserData = user => {
  const updateUser = user;
  _store.state = {
    ..._store.state,
    user: updateUser
  };

  setLocalData("user", updateUser);
  _broadcast();
};

export const getUserData = () =>
  getLocalData("user") || _store.state.user || {};

export const setAccessToken = accessToken => {
  _store.state = {
    ..._store.state,
    accessToken
  };

  setLocalData("accessToken", accessToken);
};

export const getAccessToken = () =>
  getLocalData("accessToken") || _store.state.accessToken || "";

export const setRefreshToken = refreshToken => {
  _store.state = {
    ..._store.state,
    refreshToken
  };

  setLocalData("refreshToken", refreshToken);
};

export const getRefreshToken = () =>
  getLocalData("refreshToken") || _store.state.refreshToken || "";

export const logoutUser = () => {
  setAccessToken("");
  setRefreshToken("");
  setUserData({});
  _broadcast();
  return true;
};
