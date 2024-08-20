import React, { useEffect, useRef } from 'react';
import ShineBorder from '@/components/magicui/ShineBorder';

interface ShineBorderModalProps {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
}

const ShineBorderModal: React.FC<ShineBorderModalProps> = ({
  children,
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null); // 引用 ShineBorder 组件

  // 点击 ShineBorder 以外的区域时关闭 Modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // 如果点击发生在 ShineBorder 以外，则关闭 Modal
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside);

    // 在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, onClose]);

  // 如果 show 为 false，则不渲染 Modal
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ShineBorder
        ref={modalRef}
        className="absolute top-1/2 left-1/2 z-50 rounded-lg bg-background md:shadow-xl transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
        color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
      >
        {children}
      </ShineBorder>
    </div>
  );
};

export default ShineBorderModal;
