"use client";

import Output from "editorjs-react-renderer";

type Props = {
  description: string;
};

/**
 *
 */
export const ProductDescription: React.FC<Props> = ({ description }) => {
  return <Output data={JSON.parse(description)} />;
};
