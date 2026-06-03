import * as React from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { IconCircleCheckFilled, IconPaperclip, type TablerIcon } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { Spinner } from "@/spinner/Spinner.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizePaddingLeftClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

const chooseButtonHeightClasses: Record<Size, string> = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
};

const chooseButtonPaddingClasses: Record<Size, string> = {
  sm: 'px-2.5',
  md: 'px-3',
  lg: 'px-4',
};

const chooseButtonFontClasses: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};

export type InputFileSingleProps = {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  placeholder?: string;
  buttonText?: string;
  Icon?: TablerIcon;
  size?: Size;
  value?: File | null;
  isUploaded?: boolean;
  isUploading?: boolean;
  onChange?: (file: File | null) => void | Promise<void>;
  onDropRejected?: (fileRejections: FileRejection[]) => void;
  accept?: Accept;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  className?: string;
}


export const InputFileSingle = (props: InputFileSingleProps) => {

  const {
    label,
    description,
    error,
    placeholder = 'No file chosen',
    buttonText = 'Choose',
    Icon = IconPaperclip,
    size = 'md',
    value,
    isUploaded = false,
    isUploading = false,
    onChange,
    onDropRejected,
    accept,
    maxSize,
    minSize,
    disabled = false,
    className,
  } = props;

  const handleDrop = async (acceptedFiles: File[]) => {
    const [ file ] = acceptedFiles;
    if (file) {
      await onChange?.(file);
    }
  };

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isFocused,
  } = useDropzone({
    multiple: false,
    accept,
    maxSize,
    minSize,
    disabled,
    onDrop: handleDrop,
    onDropRejected,
  });

  const fileName = value?.name;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames('flex flex-col', className) }>
        <InputLabel>{ label }</InputLabel>
        <div
          { ...getRootProps({
            className: classNames(
              'flex flex-row items-center',
              'border-[length:var(--border-width-input)] input-base rounded-[var(--border-radius-input)] shadow-[var(--shadow-control)] transition-all duration-[var(--control-transition-duration)]',
              'ring-0 focus:outline-none',
              (isFocused || isDragActive) && 'ring-[length:var(--control-ring-width)]',
              error && 'input-error',
              disabled && 'opacity-60 cursor-not-allowed',
              sizeHeightClasses[size],
              sizePaddingLeftClasses[size],
              'gap-3',
            ),
          }) }
        >
          <input { ...getInputProps() } />
          <Icon className={ classNames('input-icon shrink-0', sizeIconClasses[size]) }/>
          <span
            className={ classNames(
              'flex-1 truncate',
              sizeFontClasses[size],
              !fileName && 'text-[var(--color-input-placeholder)]',
            ) }
          >
            { fileName ?? placeholder }
          </span>
          { error && (
            <InputErrorIcon/>
          ) }
          { isUploading && !error && (
            <div className={ 'h-5 w-5 flex items-center justify-center' }>
              <Spinner className={ 'h-4 w-4 text-[var(--color-input-icon)]' }/>
            </div>
          ) }
          { isUploaded && !isUploading && !error && (
            <div className={ 'h-5 w-5' }>
              <IconCircleCheckFilled className={ 'h-5 w-5 text-[var(--color-status-success)]' }/>
            </div>
          ) }
          <button
            type={ 'button' }
            disabled={ disabled }
            onClick={ (e) => {
              e.stopPropagation();
              open();
            } }
            className={ classNames(
              'inline-flex flex-row items-center justify-center shrink-0',
              'border-[length:var(--border-width-input)] button-white shadow-[var(--shadow-control)] rounded-[calc(var(--border-radius-button)-0.25rem)]',
              'font-[number:var(--font-weight-button)] font-[family-name:var(--font-family-base)] cursor-pointer select-none transition-all duration-[var(--control-transition-duration)]',
              'button-ring ring-0 hover:ring-[length:var(--control-ring-width)] active:ring-[length:var(--control-ring-width-active)] focus:outline-none focus:ring-[length:var(--control-ring-width)]',
              'disabled:cursor-default',
              'mr-1.5',
              chooseButtonHeightClasses[size],
              chooseButtonPaddingClasses[size],
              chooseButtonFontClasses[size],
            ) }
          >
            { buttonText }
          </button>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
