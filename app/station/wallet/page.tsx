'use client';

import { useConnectedWallet, useLcdClient } from '@terra-money/wallet-kit';
import React, { useEffect, useState } from 'react';
import ShineBorder from '@/components/magicui/ShineBorder';
import ShineBorderModal from '@/components/magicui/ShineBorderModal';
import { MagicCard } from '@/components/magicui/MagicCard';
import { convertDenom, formatAmount } from '@/utils/convertDenom';
import Avatar from '@mui/material/Avatar';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { IconButton } from '@mui/material';
import { getBalances } from '@/lib/terraClassicLcdService/api/lcdApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface Balance {
  denom: string;
  amount: string;
}

const Wallet: React.FC = () => {
  const connected = useConnectedWallet();
  const tokenInfo = useSelector((state: RootState) => state.tokenInfo);
  const { address } = tokenInfo;
  const [showModal, setShowModal] = useState(false);

  const [balances, setBalances] = useState<Balance[]>([]);
  const [tokenInfos, setTokenInfos] = useState<{
    [key: string]: { price: number; image: string };
  }>({});

  useEffect(() => {
    const getTokenInfos = async () => {
      try {
        const response = await fetch('/api/wallet/getTokenInfos');
        const res = await response.json();
        const now = Date.now();
        setTokenInfos(res);

        return res;
      } catch (error) {
        console.error('Error fetching token prices:', error);
        return null;
      }
    };

    const fetchBalancesAndPrices = async () => {
      if (connected) {
        const prices = await getTokenInfos();
        if (prices) setTokenInfos(prices);

        // Await the getBalances call to resolve the promise
        const coins = await getBalances(address);

        let balanceList;
        if (coins !== null) {
          // Assuming coins.balances is the array of balances in the response
          balanceList = coins.balances.map((coin: any) => ({
            denom: coin.denom,
            amount: coin.amount.toString(),
          }));
        }

        setBalances(balanceList || []);
      } else {
        setBalances([]);
      }
    };

    fetchBalancesAndPrices();
  }, [connected]);

  return (
    <>
      <div className={'flex h-full w-full flex-col gap-4 relative'}>
        <MagicCard className="flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl ">
          <div className="py-10 h-full">
            <div className="flex justify-evenly h-full">
              <div className="flex flex-col w-7/12 h-full">
                <div className="p-2">Native Token</div>
                <div className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none ">
                  {connected && balances.length > 0 ? (
                    balances.map((balance) => {
                      const { displayName, decimals, id } = convertDenom(
                        balance.denom,
                      );
                      const rawAmount = formatAmount(balance.amount, decimals);
                      const [integerPart, decimalPart] = rawAmount.split('.');
                      const formattedAmount =
                        new Intl.NumberFormat().format(Number(integerPart)) +
                        (decimalPart ? `.${decimalPart}` : '');
                      let amountInUSD = 'N/A';

                      if (tokenInfos[id.toLowerCase()]) {
                        const tokenPrice =
                          tokenInfos[id.toLowerCase()].price || 0;
                        amountInUSD = (Number(rawAmount) * tokenPrice).toFixed(
                          2,
                        );
                      }

                      return (
                        <div
                          className="flex items-center border-b-2 justify-between"
                          key={id}
                        >
                          <div
                            key={balance.denom}
                            className="flex items-center p-4 "
                          >
                            <div>
                              <div className="flex items-center md:min-w-96">
                                <Avatar
                                  className="mr-4 text-lg"
                                  alt={`${displayName} logo`}
                                  src={
                                    tokenInfos[id.toLowerCase()]?.image || ''
                                  }
                                  sx={{ width: 32, height: 32 }}
                                />
                                <div className="text-base mr-3 px-2">
                                  <span>{displayName}</span>
                                </div>
                                <div>
                                  <span className="text-cyan-200 px-2">
                                    {formattedAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm px-2">≈</span>
                            </div>
                            <div>
                              <span className="text-cyan-200 px-2">
                                ${amountInUSD}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm">USD</span>
                            </div>
                          </div>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setShowModal(true);
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'white',
                                cursor: 'pointer',
                              },
                            }}
                          >
                            <SendRoundedIcon />
                          </IconButton>
                        </div>
                      );
                    })
                  ) : (
                    <p>loading data...</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-4/12 h-full">
                <div className="p-2">CW20 Token</div>
                <div className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none ">
                  {connected && balances.length > 0 ? (
                    balances.map((balance) => {
                      const { displayName, decimals, id } = convertDenom(
                        balance.denom,
                      );
                      const rawAmount = formatAmount(balance.amount, decimals);
                      const [integerPart, decimalPart] = rawAmount.split('.');
                      const formattedAmount =
                        new Intl.NumberFormat().format(Number(integerPart)) +
                        (decimalPart ? `.${decimalPart}` : '');
                      let amountInUSD = 'N/A';

                      if (tokenInfos[id.toLowerCase()]) {
                        const tokenPrice =
                          tokenInfos[id.toLowerCase()].price || 0;
                        amountInUSD = (Number(rawAmount) * tokenPrice).toFixed(
                          2,
                        );
                      }

                      return (
                        <div
                          className="flex items-center border-b-2 justify-between"
                          key={id}
                        >
                          <div
                            key={balance.denom}
                            className="flex items-center p-4 "
                          >
                            <div>
                              <div className="flex items-center md:min-w-96">
                                <Avatar
                                  className="mr-4 text-lg"
                                  alt={`${displayName} logo`}
                                  src={
                                    tokenInfos[id.toLowerCase()]?.image || ''
                                  }
                                  sx={{ width: 32, height: 32 }}
                                />
                                <div className="text-base mr-3 px-2">
                                  <span>{displayName}</span>
                                </div>
                                <div>
                                  <span className="text-cyan-200 px-2">
                                    {formattedAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setShowModal(true);
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'white',
                                cursor: 'pointer',
                              },
                            }}
                          >
                            <SendRoundedIcon />
                          </IconButton>
                        </div>
                      );
                    })
                  ) : (
                    <p>loading data...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MagicCard>

        {/* <ShineBorder
          className="absolute left-1/2 top-1/2 z-50 flex flex-col items-center justify-center rounded-lg bg-background md:shadow-xl transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
          color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
        >
          <div className="p-2">CW20 Tokens</div>
          <div className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none "></div>
          <button
            className="mt-4 p-2 bg-red-500 text-white rounded-md z-50"
            onClick={() => setShowModal(false)} // 点击按钮关闭 Modal
          >
            Close Modal
          </button>
        </ShineBorder> */}
        <ShineBorderModal show={showModal} onClose={() => setShowModal(false)}>
          <div className="p-2">Swap Token</div>
        </ShineBorderModal>
      </div>
    </>
  );
};

export default Wallet;
