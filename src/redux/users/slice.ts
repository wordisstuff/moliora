import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: null | {
        id: string;
        email: string;
        phone: string;
        name: string;
        token: string;
        privacyAgreed: boolean;
        agreedAt?: string;
    };
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState['user']>) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
        setPrivacy(state) {
            if (state.user) {
                state.user.privacyAgreed = true;
                state.user.agreedAt = new Date().toISOString();
            }
        },
    },
});

export const { setUser, logout, setPrivacy } = userSlice.actions;
export default userSlice.reducer;
