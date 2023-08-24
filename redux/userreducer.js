import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api'; // Update the path to your api module

const initialState = {
    isLoading: false,
    user: null,
    isError: false,
};

export const getUser = createAsyncThunk('getUser', async () => {
    try {
        const response = await api.get('/users'); // Update the API endpoint
        return response.data; // Assuming the response data contains the user details
    } catch (error) {
        throw new Error(error.message);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false; // Reset error state when starting the request
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isError = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                console.log(action.error.message);
            });
    },
    reducers: {
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
