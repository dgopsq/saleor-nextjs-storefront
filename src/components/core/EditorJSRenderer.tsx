import edjsHTML from "editorjs-html";

type Props = {
  data: string;
};

/**
 *
 */
export const EditorJSRenderer: React.FC<Props> = ({ data }) => {
  const edjsParser = edjsHTML();
  const parsedDescription = edjsParser.parse(JSON.parse(data));

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedDescription.join("") }} />
  );
};
