import { useCallback, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";

export type LexicalSelectionStyleResult = {
  /** Current selection value per property — the default when unset, "" when
   * the selection mixes several values. */
  values: Record<string, string>;
  /** Patch inline styles onto the selection; null removes a property. */
  patch: (patch: Record<string, string | null>) => void;
};

/* Reads inline style values from the current selection and patches them back
 * via $patchStyleText. Drives selection-level typography controls (font
 * family/size, color, letter-spacing, …). */
export const useLexicalSelectionStyle = (
  properties: string[],
  defaults?: Record<string, string>,
): LexicalSelectionStyleResult => {
  const [ editor ] = useLexicalComposerContext();

  // Re-subscribe only when the actual property list changes, not on every
  // render with a fresh array literal.
  const propertiesKey = properties.join("|");
  const stableProperties = useMemo(() => propertiesKey.split("|").filter(Boolean), [ propertiesKey ]);

  const [ values, setValues ] = useState<Record<string, string>>(() =>
    Object.fromEntries(stableProperties.map((property) => [ property, defaults?.[property] ?? "" ])),
  );

  useEffect(() => {
    const readSelection = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        // Read every value inside the read() context (Lexical error #195).
        const next = Object.fromEntries(
          stableProperties.map((property) => [
            property,
            $getSelectionStyleValueForProperty(selection, property, defaults?.[property] ?? ""),
          ]),
        );
        setValues((prev) => {
          const changed = stableProperties.some((property) => prev[property] !== next[property]);
          return changed ? next : prev;
        });
      });
    };

    readSelection();
    return editor.registerUpdateListener(() => readSelection());
    // defaults is treated as fixed for the lifetime of the hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ editor, stableProperties ]);

  const patch = useCallback(
    (stylePatch: Record<string, string | null>) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, stylePatch);
        }
      });
    },
    [ editor ],
  );

  return { values, patch };
};
