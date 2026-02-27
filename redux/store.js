import { configureStore } from '@reduxjs/toolkit';
import hospital_detailsReducer from './features/hospitalDetailSlice';
import hospitalReducer from './features/hospitalSlice';
import facilitiesReducer from './features/facilitiesSlice';
import doctorReducer from './features/doctorSlice';
import newsReducer from './features/newsSlice';
export const store = configureStore({
  reducer: {
    hospital: hospitalReducer,
    hospital_details: hospital_detailsReducer,
    facility: facilitiesReducer,
    doctor: doctorReducer,
    news: newsReducer
  },
});
