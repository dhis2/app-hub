export const getUserInfo = (state) => state.user.userInfo

export const getUserProfile = (state) => getUserInfo(state).profile

export const getUserId = (state) => getUserInfo(state).userId

export const isManager = (state) => {
    const userInfo = getUserInfo(state)
    return userInfo?.profile?.manager
}
