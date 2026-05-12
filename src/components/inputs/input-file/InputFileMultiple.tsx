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

  const [ entries, setEntries ] = useState<UploadEntry[]>([]);
  const idCounter = useRef(0);

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
    <div className={ classNames('flex flex-col', className) }>
      <InputLabel>{ label }</InputLabel>

      <div
        { ...getRootProps({
          className: classNames(
            'flex flex-col items-center justify-center gap-1',
            'border-2 border-dashed input-base rounded-xl bg-transparent!',
            'py-10 px-6 cursor-pointer transition-all duration-150',
            'ring-0 focus:outline-none',
            (isFocused || isDragActive) && 'ring-4',
            error && 'input-error',
            disabled && 'opacity-60 cursor-not-allowed',
          ),
        }) }
      >
        <input { ...getInputProps() } />
        <div className={ 'h-14 w-14 rounded-xl flex items-center justify-center bg-[var(--color-input-file-icon-bg)] mb-2' }>
          <Icon className={ 'h-7 w-7 input-icon' }/>
        </div>
        <div className={ 'text-base font-semibold' }>
          { title }
        </div>
        { hint && (
          <div className={ 'text-sm text-[var(--color-input-description-text)] ' }>{ hint }</div>
        ) }
      </div>

      { entries.length > 0 && (
        <div className={ 'flex flex-col gap-2 mt-3' }>
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
