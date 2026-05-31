import type { Klass, LexicalNode } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

/* Node types the editor is allowed to produce. A command for a node that is not
 * registered here silently does nothing, so keep this in sync with the toolbar. */
export const LEXICAL_NODES: Array<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
];

/* Maps Lexical node kinds to CSS class names. Keep aligned with InputLexical.css. */
export const lexicalTheme = {
  paragraph: "lexical-paragraph",
  heading: {
    h1: "lexical-h1",
    h2: "lexical-h2",
    h3: "lexical-h3",
    h4: "lexical-h4",
  },
  quote: "lexical-quote",
  list: {
    ul: "lexical-ul",
    ol: "lexical-ol",
    listitem: "lexical-listitem",
    nested: {
      listitem: "lexical-listitem-nested",
    },
  },
  link: "lexical-link",
  text: {
    bold: "lexical-bold",
    italic: "lexical-italic",
    underline: "lexical-underline",
  },
};
