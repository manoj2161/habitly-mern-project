const url = import.meta.env.VITE_API_URL;

export const register = `${url}/api/auth/user/register`;
export const login = `${url}/api/auth/user/login`;
export const profile = `${url}/api/auth/user/dashboard/profile`;
export const createHabit = `${url}/api/auth/user/dashboard/habits`;
export const getCompletionDates = `${url}/api/auth/user/dashboard/habits/:habitId/completion`;
export const addCompletionDate = `${url}/api/auth/user/dashboard/habits/:habitId/completion`;
export const removeCompletionDate = `${url}/api/auth/user/dashboard/habits/:habitId/completion`;
export const editHabit = `${url}/api/auth/user/dashboard/habits/:habitId/update`;
export const deleteHabit = `${url}/api/auth/user/dashboard/habits/:habitId/delete`;
export const updateUserName = `${url}/api/auth/user/dashboard/profile/name`;
export const changePassword = `${url}/api/auth/user/dashboard/profile/password`;
export const deleteAccount = `${url}/api/auth/user/dashboard/profile/delete`;
export const forgotPasswordEmail = `${url}/api/auth/user/forgot-password/email`;
export const resetPassword = `${url}/api/auth/user/forgot-password/reset`;
