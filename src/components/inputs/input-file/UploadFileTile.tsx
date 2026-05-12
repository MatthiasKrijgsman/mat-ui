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
        'flex flex-row items-center gap-3',
        'border input-base rounded-xl shadow-sm',
        'pl-4 pr-1 py-1',
        error && 'input-error',
        className,
      ) }
    >
      { showStatus && (
        <div className={ 'shrink-0 h-5 w-5 flex items-center justify-center' }>
          { error ? (
            <IconExclamationCircleFilled className={ 'h-5 w-5 input-error-icon' }/>
          ) : isUploading ? (
            <Spinner className={ 'h-4 w-4 text-[var(--color-input-icon)]' }/>
          ) : (
            <IconCircleCheckFilled className={ 'h-5 w-5 text-[var(--color-status-success)]' }/>
          ) }
        </div>
      ) }

      <div className={ 'flex-1 min-w-0 font-medium truncate' }>
        { file.name }
      </div>

      <div className={ 'shrink-0 text-sm text-[var(--color-input-description-text)]' }>
        { formatBytes(file.size) }
      </div>

      { onRemove && (
        <ButtonIconSquare
          variant={ 'transparent' }
          size={ 'sm' }
          Icon={ IconX }
          onClick={ onRemove }
          aria-label={ 'Remove file' }
          className={ 'shrink-0' }
        />
      ) }
    </div>
  );
};
