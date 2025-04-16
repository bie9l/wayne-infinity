import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resourcesReducer from './slices/resourcesSlice';
import securityReducer from './slices/securitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourcesReducer,
    security: securityReducer,
  },
}); 