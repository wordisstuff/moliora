import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
    message: string | null;
    type: 'success' | 'error' | 'info';
}

const initialState: ToastState = {
    message: null,
    type: 'info',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showToast(state, action: PayloadAction<ToastState>) {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearToast(state) {
            state.message = null;
        },
    },
});

export const { showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
