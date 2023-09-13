import { configureStore } from '@reduxjs/toolkit';
import userreducer from './userreducer';

export const store = configureStore({
    reducer: { user: userreducer },

})