import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessLogs: [],
  alerts: [],
  restrictedAreas: [],
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
        case 'accessLogs':
          state.accessLogs = data;
          break;
        case 'alerts':
          state.alerts = data;
          break;
        case 'restrictedAreas':
          state.restrictedAreas = data;
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
    addAccessLog: (state, action) => {
      state.accessLogs.unshift(action.payload);
    },
    addRestrictedArea: (state, action) => {
      state.restrictedAreas.push(action.payload);
    },
    updateRestrictedArea: (state, action) => {
      state.restrictedAreas = state.restrictedAreas.map((area) =>
        area.id === action.payload.id ? action.payload : area
      );
    },
    removeRestrictedArea: (state, action) => {
      state.restrictedAreas = state.restrictedAreas.filter(
        (area) => area.id !== action.payload
      );
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addAlert,
  updateAlert,
  addAccessLog,
  addRestrictedArea,
  updateRestrictedArea,
  removeRestrictedArea,
} = securitySlice.actions;

export default securitySlice.reducer; 