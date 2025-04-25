import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  logs: [],
  isLoading: false,
  error: null,
  dashboardData: null,
};

export const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      const { type, data } = action.payload;
      switch (type) {
        case 'alerts':
          state.alerts = data;
          break;
        case 'logs':
          state.logs = data;
          break;
        case 'dashboard':
          state.dashboardData = data;
          break;
        default:
          break;
      }
    },
    fetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
    },
    updateAlert: (state, action) => {
      state.alerts = state.alerts.map((alert) =>
        alert.id === action.payload.id ? action.payload : alert
      );
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    addLog: (state, action) => {
      state.logs.unshift(action.payload);
    }
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addAlert,
  updateAlert,
  removeAlert,
  addLog
} = securitySlice.actions;

export default securitySlice.reducer; 