'use client';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
export const Dialog = DialogPrimitive.Root;
export const DialogHeader = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}/>;
export const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({className, ...props}, ref) => <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props}/>);
DialogTitle.displayName = 'DialogTitle';
export const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {showClose?: boolean; overlayClassName?: string}>(({className, children, showClose = true, overlayClassName, ...props}, ref) => <DialogPrimitive.Portal>
  <DialogPrimitive.Overlay className={cn('fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm', overlayClassName)}/>
  <DialogPrimitive.Content ref={ref} aria-describedby={undefined} className={cn('fixed left-1/2 top-1/2 z-[101] w-[calc(100%-24px)] max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-white p-6 shadow-lg', className)} {...props}>
    {children}
    {showClose && <DialogPrimitive.Close className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-black shadow-sm"><X className="h-4 w-4"/><span className="sr-only">Close</span></DialogPrimitive.Close>}
  </DialogPrimitive.Content>
</DialogPrimitive.Portal>);
DialogContent.displayName = 'DialogContent';
