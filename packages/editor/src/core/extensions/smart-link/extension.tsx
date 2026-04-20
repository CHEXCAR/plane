/**
 * Smart-link extension — paste rule + NodeView (CHEXCAR addition).
 */
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { SmartLinkExtensionConfig } from "./extension-config";
import { ESmartLinkAttributeNames } from "./types";
import type { TSmartLinkAttributes } from "./types";

type Props = {
  widgetCallback: (args: { url: string; layout: "inline" | "block" }) => React.ReactNode;
};

const URL_RE = /^https?:\/\/[^\s<>"']+$/i;

export function SmartLinkExtension(props: Props) {
  return SmartLinkExtensionConfig.extend({
    addNodeView() {
      return ReactNodeViewRenderer((nodeProps: NodeViewProps) => {
        const attrs = nodeProps.node.attrs as TSmartLinkAttributes;
        const url = attrs[ESmartLinkAttributeNames.URL] || "";
        const layout = attrs[ESmartLinkAttributeNames.LAYOUT] || "block";
        return (
          <NodeViewWrapper data-smart-link-url={url} data-smart-link-layout={layout}>
            {props.widgetCallback({ url, layout })}
          </NodeViewWrapper>
        );
      });
    },

    addProseMirrorPlugins() {
      const type = this.type;
      return [
        new Plugin({
          key: new PluginKey("smart-link-paste"),
          props: {
            handlePaste(view, event) {
              const text = event.clipboardData?.getData("text/plain")?.trim() || "";
              if (!text || !URL_RE.test(text)) return false;
              // Only convert if the pasted content is ONLY a URL
              const { state, dispatch } = view;
              const { $from } = state.selection;
              // Don't convert inside a code block
              if ($from.parent.type.name === "codeBlock") return false;
              const node = type.create({
                [ESmartLinkAttributeNames.URL]: text,
                [ESmartLinkAttributeNames.LAYOUT]: "block",
              });
              const tr = state.tr.replaceSelectionWith(node).scrollIntoView();
              dispatch(tr);
              event.preventDefault();
              return true;
            },
          },
        }),
      ];
    },
  });
}
