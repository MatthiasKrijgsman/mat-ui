import * as React from "react";
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";
import { ButtonIconRound } from "@/components/button-icon-round/ButtonIconRound.tsx";
import { IconX } from "@tabler/icons-react";
import { useDismiss } from "@/hooks/use-dismiss.ts";

export type ModalProps = {
  open: boolean;
  className?: string;
  onDismiss?: () => void;
  enableDismissOnOutsideClick?: boolean,
  enableDismissOnEscKey?: boolean,
  enableDismissButton?: boolean,
  children?: React.ReactNode;
  maxWidth?: number;
}

export const Modal = (props: ModalProps) => {
  const {
    open,
    onDismiss,
    enableDismissOnOutsideClick,
    enableDismissOnEscKey,
    enableDismissButton,
    className,
    children,
    maxWidth = 600
  } = props;

  useDismiss(!!enableDismissOnEscKey && open, onDismiss ? onDismiss : () => {});

  return (
    <AnimatePresence>
      { open && (
        <FloatingPortal>
          <motion.div
            className={ 'mat:fixed mat:inset-0 mat:z-40' }
            style={ { transformOrigin: 'center' } }
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            exit={ { opacity: 0 } }
            transition={ { duration: 0.15, ease: "easeInOut" } }
          >
            <FloatingOverlay
              className={ 'modal-overlay mat:backdrop-blur-[1px]' }
              onClick={ enableDismissOnOutsideClick ? onDismiss : undefined }
              lockScroll={ true }
            />
          </motion.div>

          <div className={ 'mat:fixed mat:inset-0 mat:flex mat:flex-col mat:items-center mat:pointer-events-none mat:p-4 mat:lg:p-12 mat:overflow-y-auto mat:z-50' }>
            <motion.div
              className={ classNames(
                'mat:flex mat:flex-col modal-content mat:rounded-[var(--border-radius-panel)] mat:shadow-[var(--shadow-overlay)] mat:p-6 mat:lg:p-12 mat:pointer-events-auto mat:w-full mat:relative',
                className
              ) }
              style={ { transformOrigin: 'bottom', maxWidth: maxWidth } }
              initial={ { opacity: 0, scale: 0.98, translateY: 10 } }
              animate={ { opacity: 1, scale: 1, translateY: 0 } }
              exit={ { opacity: 0, scale: 0.98, translateY: 10 } }
              transition={ { duration: 0.15, ease: 'easeInOut' } }
            >
              { enableDismissButton && (
                <ButtonIconRound
                  Icon={ IconX }
                  className={ 'mat:absolute mat:top-4 mat:right-4' }
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