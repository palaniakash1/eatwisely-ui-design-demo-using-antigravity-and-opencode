import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  userRole: null,
  token: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
      state.error = null
    },
    signInSuccess: (state, action) => {
      const payload = action.payload;
      if (payload.user) {
        state.currentUser = payload.user;
        state.userRole = payload.role || payload.user.role || 'user';
        state.token = payload.token;
      } else {
        state.currentUser = payload;
        state.userRole = payload.role || 'user';
      }
      state.loading = false
      state.error = null
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    updateUserFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    deleteUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null
      state.loading = false
      state.error = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    signOut: (state) => {
      state.currentUser = null
      state.userRole = null
      state.token = null
      state.error = null
      state.loading = false
    },
    signOutSuccess: (state) => {
      state.currentUser = null
      state.userRole = null
      state.token = null
      state.error = null
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
  signOutSuccess,
  clearError,
} = userSlice.actions

export default userSlice.reducer
