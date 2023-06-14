import edjsHTML from "editorjs-html";

type Props = {
  description: string;
};

/**
 *
 */
export const ProductDescription: React.FC<Props> = ({ description }) => {
  const edjsParser = edjsHTML();
  const parsedDescription = edjsParser.parse(JSON.parse(description));

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedDescription.join("") }} />
  );
};
