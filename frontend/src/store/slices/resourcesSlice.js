import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  equipment: [],
  vehicles: [],
  securityDevices: [],
  isLoading: false,
  error: null,
  dashboardData: null,
};

export const resourcesSlice = createSlice({
  name: 'resources',
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
        case 'equipment':
          state.equipment = data;
          break;
        case 'vehicles':
          state.vehicles = data;
          break;
        case 'securityDevices':
          state.securityDevices = data;
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
    addItem: (state, action) => {
      const { type, item } = action.payload;
      switch (type) {
        case 'equipment':
          state.equipment.push(item);
          break;
        case 'vehicles':
          state.vehicles.push(item);
          break;
        case 'securityDevices':
          state.securityDevices.push(item);
          break;
        default:
          break;
      }
    },
    updateItem: (state, action) => {
      const { type, item } = action.payload;
      switch (type) {
        case 'equipment':
          state.equipment = state.equipment.map((eq) =>
            eq.id === item.id ? item : eq
          );
          break;
        case 'vehicles':
          state.vehicles = state.vehicles.map((v) =>
            v.id === item.id ? item : v
          );
          break;
        case 'securityDevices':
          state.securityDevices = state.securityDevices.map((d) =>
            d.id === item.id ? item : d
          );
          break;
        default:
          break;
      }
    },
    removeItem: (state, action) => {
      const { type, id } = action.payload;
      switch (type) {
        case 'equipment':
          state.equipment = state.equipment.filter((eq) => eq.id !== id);
          break;
        case 'vehicles':
          state.vehicles = state.vehicles.filter((v) => v.id !== id);
          break;
        case 'securityDevices':
          state.securityDevices = state.securityDevices.filter((d) => d.id !== id);
          break;
        default:
          break;
      }
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addItem,
  updateItem,
  removeItem,
} = resourcesSlice.actions;

export default resourcesSlice.reducer; 