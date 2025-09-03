import * as React from "react";
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";
import { ButtonIconRound } from "@/ButtonIconRound.tsx";
import { IconX } from "@tabler/icons-react";

export type ModalProps = {
  open: boolean;
  className?: string;
  onOutsideClick?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  maxWidth?: number;
}

export const Modal = (props: ModalProps) => {
  const {
    open,
    onOutsideClick,
    onClose,
    className,
    children,
    maxWidth = 600
  } = props;


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
              className={ 'bg-gray-400/30 backdrop-blur-[1px]' }
              onClick={ onOutsideClick }
              lockScroll={ true }
            />
          </motion.div>

          <div className={ 'fixed inset-0 flex flex-col items-center pointer-events-none p-4 lg:p-12 overflow-y-auto' }>
            <motion.div
              className={ classNames(
                'flex flex-col bg-white rounded-xl shadow-xl p-6 lg:p-12 pointer-events-auto w-full relative',
                className
              ) }
              style={ { transformOrigin: 'bottom', maxWidth: maxWidth } }
              initial={ { opacity: 0, scale: 0.98, translateY: 10 } }
              animate={ { opacity: 1, scale: 1, translateY: 0 } }
              exit={ { opacity: 0, scale: 0.98, translateY: 10 } }
              transition={ { duration: 0.15, ease: 'easeInOut' } }
            >
              { onClose && (
                <ButtonIconRound
                  Icon={ IconX }
                  className={ 'absolute top-4 right-4' }
                  variant={ 'transparent' }
                  size={ 'sm' }
                  onClick={ onClose }
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