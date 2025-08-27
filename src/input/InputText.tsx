import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconExclamationCircleFilled, type TablerIcon } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";


export type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  Icon?: TablerIcon;
}


export const InputText = (props: InputTextProps) => {

  const {
    className,
    label,
    description,
    Icon,
    error,
    ...rest
  } = props;

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      { label && (
        <label className={ 'text-gray-900 font-medium mb-1' }>{ label }</label>
      ) }
      <div className={ 'flex flex-col relative' }>
        { Icon && (
          <Icon className={ 'h-4 w-4 text-gray-900/70 absolute left-4 top-4' }/>
        ) }
        <input
          className={ classNames(
            'h-12 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error && 'border-red-600 focus:ring-red-600/20 !pr-10',
          ) }
          { ...rest }
        />
        { error && (
          <AnimatePresence>
            <motion.div
              className={'h-5 w-5 absolute top-3.5 right-3.5 origin-center'}
              initial={ { opacity: 0, translateX: -8, scale: 0.90 } }
              animate={ { opacity: 1, translateX: 0, scale: 1.0 } }
              exit={ { opacity: 0, translateX: -8, scale: 0.90 } }
              transition={ { duration: 0.1, ease: 'easeInOut' } }
            >
              <IconExclamationCircleFilled className={'h-5 w-5 text-red-600'} />
            </motion.div>
          </AnimatePresence>
        ) }
      </div>
      { description && (
        <div className={ 'text-gray-500 text-sm font-medium mt-2' }>{ description }</div>
      ) }
      { error && (
        <div className={ 'text-red-600 text-sm font-medium mt-2' }>{ error }</div>
      ) }
    </div>
  );
};