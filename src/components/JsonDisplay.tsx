
import React from "react";

type JsonDisplayProps = {
  data: any;
  title?: string;
};

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data, title }) => {
  // Format JSON for display with proper syntax highlighting
  const formatJson = (obj: any): JSX.Element => {
    const json = JSON.stringify(obj, null, 2);
    
    const highlighted = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-value"; // number, boolean, null
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "json-key"; // key
          } else {
            cls = "json-string"; // string
          }
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
    
    return (
      <div
        className="json-display overflow-auto"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {title}
        </h3>
      )}
      {formatJson(data)}
    </div>
  );
};

export default JsonDisplay;
