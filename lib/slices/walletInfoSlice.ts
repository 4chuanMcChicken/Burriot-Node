import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletInfo {
  address: string;
  name?: string;
}

const initialState: WalletInfo = {
  address: '',
  name: '',
};

const walletInfoSlice = createSlice({
  name: 'walletInfo',
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<WalletInfo>) => {
      state.address = action.payload.address;
      state.name = action.payload.name;
    },

    resetWalletInfo: (state) => {
      state.address = '';
      state.name = '';
    },
  },
});

export const { setWalletInfo, resetWalletInfo } = walletInfoSlice.actions;
export default walletInfoSlice.reducer;
