import axiosLcd from '@/services/axiosLcdInstance'; // 使用封装好的 axios 实例
import { FormattedBalanceResponse } from '../type/lcdInterface';

const api = {
  bankBalances: '/cosmos/bank/v1beta1/balances/',
};

export const getBalances = async (
  address: string,
): Promise<FormattedBalanceResponse | null> => {
  try {
    const response = await axiosLcd.get(`${api.bankBalances}${address}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
