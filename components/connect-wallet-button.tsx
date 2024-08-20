import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Popover } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-kit';
import { useDispatch } from 'react-redux';
import { setWalletInfo, resetWalletInfo } from '@/lib/slices/walletInfoSlice'; // 根据实际路径修改

const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const { connect, disconnect, availableWallets } = useWallet();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDisconnectClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConnectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWalletConnect = async (walletId: string) => {
    connect(walletId);
    handleClose(); // 连接钱包后关闭 Popover
  };

  useEffect(() => {
    if (connectedWallet) {
      // 将地址和名称同步到 Redux 中
      dispatch(
        setWalletInfo({
          address: connectedWallet.addresses['columbus-5'],
        }),
      );
    } else {
      // 当钱包断开时，重置 Redux 状态
      dispatch(resetWalletInfo());
    }
  }, [connectedWallet, dispatch]); // 当 connectedWallet 状态变化时触发

  return (
    <div>
      {connectedWallet ? (
        <>
          <Button
            id="disconnect-button"
            variant="contained"
            onClick={handleDisconnectClick}
            sx={{
              fontWeight: '700',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
            }}
            endIcon={<WalletIcon />}
            aria-controls={open ? 'basic-popover' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {connectedWallet.name}
          </Button>
          <Popover
            id="basic-popover"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                style: {
                  marginTop: '10px',
                  borderRadius: '10px',
                },
              },
            }}
          >
            <div className="p-2">
              <div
                className="hover:bg-gray-300 rounded-md flex p-2 cursor-pointer"
                onClick={() => {
                  disconnect();
                  handleClose();
                }}
              >
                <div className="mr-3 text-s">Disconnect</div>
                <LogoutIcon />
              </div>
            </div>
          </Popover>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={handleConnectClick}
            endIcon={<WalletIcon />}
            sx={{
              fontWeight: '700',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            Connect Wallet
          </Button>
          <Popover
            id="connect-popover"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                style: {
                  marginTop: '10px',
                  borderRadius: '10px',
                },
              },
            }}
          >
            <div className="p-2">
              {availableWallets.map(({ id, name, isInstalled }) => (
                <div
                  key={id}
                  className={`hover:bg-gray-300 rounded-md flex p-2 cursor-pointer ${!isInstalled && 'opacity-50'}`}
                  onClick={() => isInstalled && handleWalletConnect(id)}
                >
                  <div className="mr-3 text-s tracking-wide">{name}</div>
                  {name === 'Browser Extension' ||
                  name === 'Station Mobile App' ? (
                    <img
                      src="/images/TerraStationLogo.svg"
                      alt="Terra Station Logo"
                      className="h-6 w-6"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          </Popover>
        </>
      )}
    </div>
  );
};

export default ConnectWalletButton;
