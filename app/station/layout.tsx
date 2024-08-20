'use client';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import Logo from '@/components/ui/logo';
import ShimmerButton from '@/components/magicui/ShimmerButton';
import { NeonGradientCard } from '@/components/magicui/NeonGradientCard';
import { AnimatedSubscribeButton } from '@/components/magicui/AnimatedSubscribeButton';
import { ChevronRightIcon } from 'lucide-react';
import WalletIcon from '@mui/icons-material/Wallet';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';

export default function StationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const walletInfo = useSelector((state: RootState) => state.tokenInfo);

  useEffect(() => {
    if (!walletInfo.address) {
      router.push('/');
    }
  }, [walletInfo, router]);

  const [selectedButton, setSelectedButton] = useState<number>(1);
  const buttons = [
    {
      id: 1,
      initialText: (
        <span className="group inline-flex items-center">
          My Wallet
          <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      ),
      changeText: (
        <span className="group inline-flex items-center">
          My Wallet
          <WalletIcon className="ml-2 h-4 w-4"></WalletIcon>
        </span>
      ),
      href: '/station/wallet',
    },
    {
      id: 2,
      initialText: (
        <span className="group inline-flex items-center">
          Staking
          <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      ),
      changeText: (
        <span className="group inline-flex items-center">
          Staking
          <AccountBalanceOutlinedIcon className="ml-2 h-4 w-4"></AccountBalanceOutlinedIcon>
        </span>
      ),
      href: '/station/staking',
    },
  ];
  return (
    <div className="h-screen bg-black flex">
      <header className="fixed h-full shadow-lg pt-6 w-72">
        <div className="relative flex flex-col w-full px-6 justify-between">
          <div className="flex-col m-auto">
            <div className="flex">
              <div className="flex items-center mr-8">
                <Logo />
              </div>
              <NeonGradientCard className="items-center justify-center text-center">
                <span className="pointer-events-none z-10 h-full whitespace-nowrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-2xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  Burrito Wallet
                </span>
              </NeonGradientCard>
            </div>
            <div className="flex-row justify-center mt-10">
              {buttons.map((button) => (
                <div
                  className="py-3 flex justify-center content-center"
                  key={button.id}
                >
                  <Link
                    href={button.href}
                    onClick={() => setSelectedButton(button.id)}
                  >
                    <AnimatedSubscribeButton
                      buttonColor="#000000"
                      buttonTextColor="#ffffff"
                      initialText={button.initialText}
                      changeText={button.changeText}
                      isSelected={selectedButton === button.id}
                      onClick={() => {}}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 pl-80">
        {/* Render the selected page (Wallet or Staking) */}
        {children}
      </div>
    </div>
  );
}
