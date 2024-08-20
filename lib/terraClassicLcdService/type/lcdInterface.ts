// 基础的分页
interface BaseLcdResponse {
  pagination: {
    nextKey: string | null;
    total: number;
  };
}

interface FormattedBalance {
  denom: string;
  amount: string;
}

export interface FormattedBalanceResponse extends BaseLcdResponse {
  balances: FormattedBalance[];
}
