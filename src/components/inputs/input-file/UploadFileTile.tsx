import * as React from "react";
import { IconCircleCheckFilled, IconExclamationCircleFilled, IconX } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { Spinner } from "@/spinner/Spinner.tsx";
import { ButtonIconSquare } from "@/components/button-icon-square/ButtonIconSquare.tsx";


export type UploadFileTileProps = {
  file: File;
  isUploaded?: boolean;
  isUploading?: boolean;
  error?: string | React.ReactNode;
  onRemove?: () => void;
  className?: string;
}


const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${ bytes } B`;
  if (bytes < 1024 * 1024) return `${ (bytes / 1024).toFixed(1) } KB`;
  if (bytes < 1024 * 1024 * 1024) return `${ (bytes / (1024 * 1024)).toFixed(1) } MB`;
  return `${ (bytes / (1024 * 1024 * 1024)).toFixed(1) } GB`;
};


export const UploadFileTile = (props: UploadFileTileProps) => {

  const {
    file,
    isUploaded = false,
    isUploading = false,
    error,
    onRemove,
    className,
  } = props;

  const showStatus = isUploading || isUploaded || !!error;

  return (
    <div
      className={ classNames(
        'mat:flex mat:flex-row mat:items-center mat:gap-3',
        'mat:border-[length:var(--border-width-input)] input-base mat:rounded-[var(--border-radius-input)] mat:shadow-[var(--shadow-control)]',
        'mat:pl-4 mat:pr-1 mat:py-1',
        error && 'input-error',
        className,
      ) }
    >
      { showStatus && (
        <div className={ 'mat:shrink-0 mat:h-5 mat:w-5 mat:flex mat:items-center mat:justify-center' }>
          { error ? (
            <IconExclamationCircleFilled className={ 'mat:h-5 mat:w-5 input-error-icon' }/>
          ) : isUploading ? (
            <Spinner className={ 'mat:h-4 mat:w-4 mat:text-[var(--color-input-icon)]' }/>
          ) : (
            <IconCircleCheckFilled className={ 'mat:h-5 mat:w-5 mat:text-[var(--color-status-success)]' }/>
          ) }
        </div>
      ) }

      <div className={ 'mat:flex-1 mat:min-w-0 mat:font-[number:var(--font-weight-input-option-label)] mat:truncate' }>
        { file.name }
      </div>

      <div className={ 'mat:shrink-0 mat:text-sm mat:text-[var(--color-input-description-text)]' }>
        { formatBytes(file.size) }
      </div>

      { onRemove && (
        <ButtonIconSquare
          variant={ 'transparent' }
          size={ 'sm' }
          Icon={ IconX }
          onClick={ onRemove }
          aria-label={ 'Remove file' }
          className={ 'mat:shrink-0' }
        />
      ) }
    </div>
  );
};
