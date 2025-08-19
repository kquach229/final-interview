'use client';
import React, { ReactNode } from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { usePathname, useSearchParams } from 'next/navigation';

type ReusableDialogProps = {
  children: ReactNode;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  title: string;
};

const ReusableDialog = ({
  children,
  open,

  handleOpenChange,
}: ReusableDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>{children}</AlertDialogContent>
    </AlertDialog>
  );
};

export default ReusableDialog;
