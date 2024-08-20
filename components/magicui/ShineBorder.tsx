'use client';

import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

const ShineBorder = forwardRef<HTMLDivElement, ShineBorderProps>(
  (
    {
      borderRadius = 8,
      borderWidth = 1,
      duration = 14,
      color = '#000000',
      className,
      children,
    },
    ref, // 接收 ref
  ) => {
    return (
      <div
        ref={ref} // 将 ref 传递给外层 div
        style={
          {
            '--border-radius': `${borderRadius}px`,
          } as React.CSSProperties
        }
        className={cn(
          'relative w-fit rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white',
          className,
        )}
      >
        <div
          style={
            {
              '--border-width': `${borderWidth}px`,
              '--border-radius': `${borderRadius}px`,
              '--shine-pulse-duration': `${duration}s`,
              '--mask-linear-gradient': `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
              '--background-radial-gradient': `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(',') : color},transparent,transparent)`,
            } as React.CSSProperties
          }
          className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`}
        ></div>
        {children}
      </div>
    );
  },
);

ShineBorder.displayName = 'ShineBorder'; // 为 forwardRef 组件添加显示名称

export default ShineBorder;
