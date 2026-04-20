/**
 * SMART_LINK node — Jira Smart-Link-style URL unfurl card.
 * Added by CHEXCAR (not upstream).
 */
export enum ESmartLinkAttributeNames {
  URL = "url",
  LAYOUT = "layout",
}

export type TSmartLinkLayout = "inline" | "block";

export type TSmartLinkAttributes = {
  [ESmartLinkAttributeNames.URL]: string | undefined;
  [ESmartLinkAttributeNames.LAYOUT]: TSmartLinkLayout;
};

export type TSmartLinkMetadata = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  site_name: string | null;
  kind?: string;
  cached?: boolean;
  age_sec?: number;
};

export type TSmartLinkFetcher = (url: string) => Promise<TSmartLinkMetadata | null>;
