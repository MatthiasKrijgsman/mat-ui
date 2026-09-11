import * as React from "react";
import { useRef, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { IconCloudUpload, type TablerIcon } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { UploadFileTile, type UploadFileTileProps } from "@/components/inputs/input-file/UploadFileTile.tsx";


type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

type UploadEntry = {
  id: string;
  file: File;
  status: UploadStatus;
  error?: Error;
}


export type InputFileMultipleProps = {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  title?: string;
  hint?: React.ReactNode;
  Icon?: TablerIcon;
  /**
   * Files that are already uploaded when the component mounts — shown as
   * completed tiles. Read once on mount (uncontrolled, like `defaultValue`);
   * later changes are ignored, and `onUpload` is never called for them.
   * Useful for restoring the list after the field unmounts and remounts.
   */
  defaultFiles?: File[];
  onUpload?: (file: File) => Promise<void> | void;
  onFileRemoved?: (file: File) => void;
  onDropRejected?: (fileRejections: FileRejection[]) => void;
  renderFileTile?: (file: File, defaultProps: UploadFileTileProps) => React.ReactNode;
  accept?: Accept;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}


export const InputFileMultiple = (props: InputFileMultipleProps) => {

  const {
    label,
    description,
    error,
    title = 'Drop files here',
    hint,
    Icon = IconCloudUpload,
    defaultFiles,
    onUpload,
    onFileRemoved,
    onDropRejected,
    renderFileTile,
    accept,
    maxSize,
    minSize,
    maxFiles,
    disabled = false,
    className,
  } = props;

  const idCounter = useRef(0);
  const [ entries, setEntries ] = useState<UploadEntry[]>(() =>
    (defaultFiles ?? []).map((file) => ({
      id: String(++idCounter.current),
      file,
      status: 'uploaded' as UploadStatus,
    })),
  );

  const updateEntry = (id: string, patch: Partial<UploadEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const newEntries: UploadEntry[] = acceptedFiles.map((file) => ({
      id: String(++idCounter.current),
      file,
      status: onUpload ? 'uploading' : 'idle',
    }));

    setEntries((prev) => [ ...prev, ...newEntries ]);

    if (!onUpload) return;

    for (const entry of newEntries) {
      Promise.resolve()
        .then(() => onUpload(entry.file))
        .then(() => updateEntry(entry.id, { status: 'uploaded' }))
        .catch((err: unknown) => {
          updateEntry(entry.id, {
            status: 'error',
            error: err instanceof Error ? err : new Error(String(err)),
          });
        });
    }
  };

  const handleRemove = (id: string) => {
    const removed = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (removed) {
      onFileRemoved?.(removed.file);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
  } = useDropzone({
    multiple: true,
    accept,
    maxSize,
    minSize,
    maxFiles,
    disabled,
    onDrop: handleDrop,
    onDropRejected,
  });

  return (
    <div className={ classNames('mat:flex mat:flex-col', className) }>
      <InputLabel>{ label }</InputLabel>

      <div
        { ...getRootProps({
          className: classNames(
            'mat:flex mat:flex-col mat:items-center mat:justify-center mat:gap-1',
            'mat:border-2 mat:border-dashed input-base mat:rounded-[var(--border-radius-input)] mat:bg-transparent!',
            'mat:py-10 mat:px-6 mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)]',
            'mat:ring-0 mat:focus:outline-none',
            (isFocused || isDragActive) && 'mat:ring-[length:var(--control-ring-width)]',
            error && 'input-error',
            disabled && 'mat:opacity-60 mat:cursor-not-allowed',
          ),
        }) }
      >
        <input { ...getInputProps() } />
        <div className={ 'mat:h-14 mat:w-14 mat:rounded-[var(--border-radius-input)] mat:flex mat:items-center mat:justify-center mat:bg-[var(--color-input-file-icon-bg)] mat:mb-2' }>
          <Icon className={ 'mat:h-7 mat:w-7 input-icon' }/>
        </div>
        <div className={ 'mat:text-base mat:font-[number:var(--font-weight-button)]' }>
          { title }
        </div>
        { hint && (
          <div className={ 'mat:text-sm mat:text-[var(--color-input-description-text)] ' }>{ hint }</div>
        ) }
      </div>

      { entries.length > 0 && (
        <div className={ 'mat:flex mat:flex-col mat:gap-2 mat:mt-3' }>
          { entries.map((entry) => {
            const defaultProps: UploadFileTileProps = {
              file: entry.file,
              isUploading: entry.status === 'uploading',
              isUploaded: entry.status === 'uploaded',
              error: entry.status === 'error' ? entry.error?.message : undefined,
              onRemove: () => handleRemove(entry.id),
            };
            return (
              <React.Fragment key={ entry.id }>
                { renderFileTile
                  ? renderFileTile(entry.file, defaultProps)
                  : <UploadFileTile { ...defaultProps }/>
                }
              </React.Fragment>
            );
          }) }
        </div>
      ) }

      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};
