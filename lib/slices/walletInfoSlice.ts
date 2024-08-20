import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletInfo {
  address: string;
}

const initialState: WalletInfo = {
  address: '',
};

const walletInfoSlice = createSlice({
  name: 'walletInfo',
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<WalletInfo>) => {
      state.address = action.payload.address;
    },

    resetWalletInfo: (state) => {
      state.address = '';
    },
  },
});

export const { setWalletInfo, resetWalletInfo } = walletInfoSlice.actions;
export default walletInfoSlice.reducer;
