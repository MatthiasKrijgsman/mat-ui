import * as React from "react";
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";
import { ButtonIconRound } from "@/components/button-icon-round/ButtonIconRound.tsx";
import { IconX } from "@tabler/icons-react";
import { useDismiss } from "@/hooks/use-dismiss.ts";

export type SidebarModalProps = {
  open: boolean;
  className?: string;
  onDismiss?: () => void;
  enableDismissOnOutsideClick?: boolean,
  enableDismissOnEscKey?: boolean,
  enableDismissButton?: boolean,
  children?: React.ReactNode;
  maxWidth?: number;
}

export const SidebarModal = (props: SidebarModalProps) => {
  const {
    open,
    onDismiss,
    enableDismissOnOutsideClick,
    enableDismissOnEscKey,
    enableDismissButton,
    className,
    children,
    maxWidth = 480
  } = props;

  useDismiss(!!enableDismissOnEscKey && open, onDismiss ? onDismiss : () => {});

  return (
    <AnimatePresence>
      { open && (
        <FloatingPortal>
          <motion.div
            style={ { transformOrigin: 'center' } }
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            exit={ { opacity: 0 } }
            transition={ { duration: 0.15, ease: "easeInOut" } }
          >
            <FloatingOverlay
              className={ 'modal-overlay backdrop-blur-[1px] z-10' }
              onClick={ enableDismissOnOutsideClick ? onDismiss : undefined }
              lockScroll={ true }
            />
          </motion.div>

          <div className={ 'fixed inset-0 flex flex-row justify-end pointer-events-none z-20' }>
            <motion.div
              className={ classNames(
                'flex flex-col modal-content shadow-xl p-6 lg:p-12 pointer-events-auto h-full w-full overflow-y-auto relative',
                className
              ) }
              style={ { maxWidth: maxWidth } }
              initial={ { translateX: '100%' } }
              animate={ { translateX: 0 } }
              exit={ { translateX: '100%' } }
              transition={ { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }
            >
              { enableDismissButton && (
                <ButtonIconRound
                  Icon={ IconX }
                  className={ 'absolute top-4 right-4' }
                  variant={ 'transparent' }
                  size={ 'sm' }
                  onClick={ onDismiss }
                />
              ) }
              { children }
            </motion.div>
          </div>
        </FloatingPortal>
      ) }
    </AnimatePresence>
  );
};
