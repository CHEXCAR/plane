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
      [ESmartLinkAttributeNames.URL]: { default: undefined },
      [ESmartLinkAttributeNames.LAYOUT]: { default: "block" },
    };
  },

  parseHTML() {
    return [{ tag: "smart-link-card" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["smart-link-card", mergeAttributes(HTMLAttributes)];
  },
});
