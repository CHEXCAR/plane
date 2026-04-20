/**
 * Smart-link node config — CHEXCAR addition.
 */
import { mergeAttributes, Node } from "@tiptap/core";
import { CORE_EXTENSIONS } from "@/constants/extension";
import { ESmartLinkAttributeNames } from "./types";

export const SmartLinkExtensionConfig = Node.create({
  name: CORE_EXTENSIONS.SMART_LINK,
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      [ESmartLinkAttributeNames.URL]: {
        default: undefined,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-url") || el.getAttribute("href") || undefined,
        renderHTML: (attrs: Record<string, unknown>) => {
          const url = attrs[ESmartLinkAttributeNames.URL];
          return url ? { "data-url": String(url) } : {};
        },
      },
      [ESmartLinkAttributeNames.LAYOUT]: {
        default: "block",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-layout") || "block",
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-layout": String(attrs[ESmartLinkAttributeNames.LAYOUT] || "block"),
        }),
      },
    };
  },

  parseHTML() {
    return [
      { tag: "smart-link-card" },
      // Back-compat: also parse any <a> that has data-smart-link="true"
      { tag: "a[data-smart-link]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["smart-link-card", mergeAttributes(HTMLAttributes)];
  },
});
