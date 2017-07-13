

export const getApp = (state, appId) => state.user.appList.byId[appId];

export const getUserInfo = state => state.user.userInfo;

export const getAuthInfo = state => getUserInfo(state).authInfo;

export const getUserAppList = state => state.user.appList;



