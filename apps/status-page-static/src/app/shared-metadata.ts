import pageConfiguration from "configurations";
import type { Metadata } from "next";

export const TITLE = pageConfiguration.metadata.title;
export const DESCRIPTION = pageConfiguration.metadata.description;

export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${TITLE}`,
    default: TITLE,
  },
  description: DESCRIPTION,
  metadataBase: pageConfiguration.metadata.imageBaseURL,
};

export const twitterMetadata: Metadata["twitter"] = {
  title: TITLE,
  description: DESCRIPTION,
  card: "summary_large_image",
  images: pageConfiguration.metadata.twitter?.images,
};

export const ogMetadata: Metadata["openGraph"] = {
  title: TITLE,
  description: DESCRIPTION,
  type: "website",
  images: pageConfiguration.metadata.og?.images,
};
