import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState = {
    isLoading: false,
    user: "hi",
    isError: false,
};


export const getUser = createAsyncThunk('getUser', async () => {
    console.log("usereducer callled")
    const token = await AsyncStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            // Add more headers as needed
        }
    };
    try {
        const response = await axios.get('http://192.168.56.1:8800/api/users', config);
        return response.data;
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
