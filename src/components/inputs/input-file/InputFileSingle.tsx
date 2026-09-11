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
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizePaddingLeftClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

const chooseButtonHeightClasses: Record<Size, string> = {
  sm: 'mat:h-7',
  md: 'mat:h-8',
  lg: 'mat:h-10',
};

const chooseButtonPaddingClasses: Record<Size, string> = {
  sm: 'mat:px-2.5',
  md: 'mat:px-3',
  lg: 'mat:px-4',
};

const chooseButtonFontClasses: Record<Size, string> = {
  sm: 'mat:text-xs',
  md: 'mat:text-sm',
  lg: 'mat:text-sm',
};

export type InputFileSingleProps = {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  placeholder?: string;
  buttonText?: string;
  Icon?: TablerIcon;
  size?: Size;
  variant?: InputVariant;
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
    variant = 'default',
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
      <div className={ classNames('mat:flex mat:flex-col', className) }>
        <InputLabel>{ label }</InputLabel>
        <div
          { ...getRootProps({
            className: classNames(
              'mat:flex mat:flex-row mat:items-center',
              'mat:border-[length:var(--border-width-input)] input-base mat:rounded-[var(--border-radius-input)] mat:transition-all mat:duration-[var(--control-transition-duration)]',
              inputVariantClasses[variant],
              'mat:ring-0 mat:focus:outline-none',
              (isFocused || isDragActive) && 'mat:ring-[length:var(--control-ring-width)]',
              error && 'input-error',
              disabled && 'mat:opacity-60 mat:cursor-not-allowed',
              sizeHeightClasses[size],
              sizePaddingLeftClasses[size],
              'mat:gap-3',
            ),
          }) }
        >
          <input { ...getInputProps() } />
          <Icon className={ classNames('input-icon mat:shrink-0', sizeIconClasses[size]) }/>
          <span
            className={ classNames(
              'mat:flex-1 mat:truncate',
              sizeFontClasses[size],
              !fileName && 'mat:text-[var(--color-input-placeholder)]',
            ) }
          >
            { fileName ?? placeholder }
          </span>
          { error && (
            <InputErrorIcon/>
          ) }
          { isUploading && !error && (
            <div className={ 'mat:h-5 mat:w-5 mat:flex mat:items-center mat:justify-center' }>
              <Spinner className={ 'mat:h-4 mat:w-4 mat:text-[var(--color-input-icon)]' }/>
            </div>
          ) }
          { isUploaded && !isUploading && !error && (
            <div className={ 'mat:h-5 mat:w-5' }>
              <IconCircleCheckFilled className={ 'mat:h-5 mat:w-5 mat:text-[var(--color-status-success)]' }/>
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
              'mat:inline-flex mat:flex-row mat:items-center mat:justify-center mat:shrink-0',
              'mat:border-[length:var(--border-width-input)] button-white mat:shadow-[var(--shadow-control)] mat:rounded-[calc(var(--border-radius-button)-0.25rem)]',
              'mat:font-[number:var(--font-weight-button)] mat:font-[family-name:var(--font-family-base)] mat:cursor-pointer mat:select-none mat:transition-all mat:duration-[var(--control-transition-duration)]',
              'button-ring mat:ring-0 mat:hover:ring-[length:var(--control-ring-width)] mat:active:ring-[length:var(--control-ring-width-active)] mat:focus:outline-none mat:focus:ring-[length:var(--control-ring-width)]',
              'mat:disabled:cursor-default',
              'mat:mr-1.5',
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
