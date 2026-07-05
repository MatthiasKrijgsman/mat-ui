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
import { LEXICAL_NODES, lexicalTheme } from "@/components/inputs/input-lexical/lexical-theme.ts";

export type LexicalInlineProps = {
  /** Serialized editor state (JSON string from a previous onChange), or undefined for empty. */
  value?: string;
  onChange?: (value: string) => void;
  namespace?: string;
  /** Extra Lexical nodes to register alongside the built-in set. */
  nodes?: Array<Klass<LexicalNode>>;
  /** Replaces the default theme entirely (pass your own class map when the
   * surrounding surface owns the text styling). Merge over `lexicalTheme`
   * yourself if you only want overrides. */
  theme?: EditorThemeClasses;
  placeholder?: string;
  autoFocus?: boolean;
  /** Applied to the ContentEditable element. */
  className?: string;
  style?: React.CSSProperties;
  /** Extra Lexical plugins (e.g. a floating toolbar). */
  children?: React.ReactNode;
};

/* Headless inline editor surface: a bare ContentEditable with the standard
 * plugin set and zero chrome — no border, label or toolbar. Made for
 * edit-in-place surfaces (builders, canvases); pair it with
 * LexicalFloatingToolbar or FloatingToolbarShell for controls. */
export const LexicalInline = (props: LexicalInlineProps) => {
  const {
    value,
    onChange,
    namespace = "LexicalInline",
    nodes,
    theme,
    placeholder,
    autoFocus = true,
    className,
    style,
    children,
  } = props;

  const initialConfig = useMemo(
    () => ({
      namespace,
      theme: theme ?? lexicalTheme,
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

  return (
    <LexicalComposer initialConfig={ initialConfig }>
      <div className={ "relative" }>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={ className }
              style={ { outline: "none", ...style } }
              aria-placeholder={ placeholder ?? "" }
              placeholder={
                <div className={ "lexical-placeholder pointer-events-none absolute left-0 top-0" }>
                  { placeholder ?? "" }
                </div>
              }
            />
          }
          ErrorBoundary={ LexicalErrorBoundary }
        />
        <HistoryPlugin/>
        <ListPlugin/>
        <LinkPlugin/>
        { autoFocus && <AutoFocusPlugin/> }
        { onChange && <OnChangePlugin onChange={ handleChange } ignoreSelectionChange={ true }/> }
        { children }
      </div>
    </LexicalComposer>
  );
};
