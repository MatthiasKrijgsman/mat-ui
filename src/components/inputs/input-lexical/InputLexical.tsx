import * as React from "react";
import { useCallback, useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { EditorState, EditorThemeClasses, Klass, LexicalNode } from "lexical";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { sizeFontClasses } from "@/control-size/control-size.util.ts";
import { LEXICAL_NODES, lexicalTheme } from "@/components/inputs/input-lexical/lexical-theme.ts";
import { LexicalToolbar } from "@/components/inputs/input-lexical/LexicalToolbar.tsx";
import { LexicalFloatingToolbar } from "@/components/inputs/input-lexical/LexicalFloatingToolbar.tsx";
import type { LexicalToolbarRender } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type Size = "sm" | "md" | "lg";
export type LexicalToolbarVariant = "static" | "floating";

export type InputLexicalProps = {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  placeholder?: string;
  /** Serialized editor state (JSON string from a previous onChange), or undefined for empty. */
  value?: string;
  onChange?: (value: string) => void;
  size?: Size;
  toolbar?: LexicalToolbarVariant;
  /** Override the default toolbar content. Drop in the exported building blocks. */
  renderToolbar?: LexicalToolbarRender;
  /** Minimum visible rows — sets a height floor for the editable area. */
  minRows?: number;
  /** Maximum visible rows. Content beyond this scrolls. */
  maxRows?: number;
  /** Grow the editor with its content (between minRows and maxRows). */
  autogrow?: boolean;
  namespace?: string;
  /** Extra Lexical nodes to register alongside the built-in set. */
  nodes?: Array<Klass<LexicalNode>>;
  /** Theme classes merged over the defaults (e.g. to style custom nodes). */
  theme?: EditorThemeClasses;
  autoFocus?: boolean;
  /** Extra Lexical plugins, mounted inside the editor alongside the built-ins. */
  children?: React.ReactNode;
  className?: string;
};

export const InputLexical = (props: InputLexicalProps) => {
  const {
    label,
    description,
    error,
    placeholder,
    value,
    onChange,
    size = "md",
    toolbar = "static",
    renderToolbar,
    minRows = 4,
    maxRows,
    autogrow = false,
    namespace = "InputLexical",
    nodes,
    theme,
    autoFocus = false,
    children,
    className,
  } = props;

  const initialConfig = useMemo(
    () => ({
      namespace,
      theme: theme ? { ...lexicalTheme, ...theme } : lexicalTheme,
      nodes: [ ...LEXICAL_NODES, ...(nodes ?? []) ],
      editorState: value ?? null,
      onError: (e: Error) => {
        throw e;
      },
    }),
    // Lexical reads initialConfig once on mount; later prop changes are ignored by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleChange = useCallback(
    (editorState: EditorState) => {
      onChange?.(JSON.stringify(editorState.toJSON()));
    },
    [ onChange ],
  );

  const fontClass = sizeFontClasses[size];
  const hasError = !!error;

  // py-3 (top + bottom) = 1.5rem; `1lh` resolves to the content line-height.
  const rowsToHeight = (rows: number) => `calc(${ rows } * 1lh + 1.5rem)`;
  const contentStyle: React.CSSProperties = autogrow
    ? { minHeight: rowsToHeight(minRows), maxHeight: maxRows ? rowsToHeight(maxRows) : undefined }
    : { height: rowsToHeight(minRows) };

  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames("flex flex-col", className) }>
        <InputLabel>{ label }</InputLabel>
        <LexicalComposer initialConfig={ initialConfig }>
          <div
            className={ classNames(
              "relative flex flex-col border input-base rounded-xl shadow-sm overflow-hidden transition-all duration-150 ring-0 focus-within:ring-4 focus-within:outline-none",
              hasError && "input-error",
            ) }
          >
            { toolbar === "static" && <LexicalToolbar render={ renderToolbar }/> }

            <div className={ "relative flex-1 min-h-0" }>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={ classNames(
                      "lexical-content w-full outline-none px-3 py-3 leading-[1.55] overflow-y-auto mat-ui-hide-scrollbars",
                      fontClass,
                    ) }
                    style={ contentStyle }
                    aria-placeholder={ placeholder ?? "" }
                    placeholder={
                      <div
                        className={ classNames(
                          "lexical-placeholder pointer-events-none absolute left-3 top-3",
                          fontClass,
                        ) }
                      >
                        { placeholder ?? "" }
                      </div>
                    }
                  />
                }
                ErrorBoundary={ LexicalErrorBoundary }
              />
            </div>

            <HistoryPlugin/>
            <ListPlugin/>
            <LinkPlugin/>
            { autoFocus && <AutoFocusPlugin/> }
            { onChange && <OnChangePlugin onChange={ handleChange }/> }
            { children }
            { toolbar === "floating" && <LexicalFloatingToolbar render={ renderToolbar }/> }
          </div>
        </LexicalComposer>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
