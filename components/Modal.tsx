'use client';

import { Dialog, DialogOverlay, DialogContent } from './ui/dialog';
import { useRouter } from 'next/navigation';

export function Modal({
  children,
  openModal,
  onClose,
}: {
  children: React.ReactNode;
  openModal: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const handleOpenChange = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <Dialog defaultOpen={true} open={openModal} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className='overflow-y-hidden'>{children}</DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
