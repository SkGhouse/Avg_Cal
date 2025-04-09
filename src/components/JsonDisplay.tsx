
import React from "react";
import { Card } from "@/components/ui/card";

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
        let cls = "text-blue-600 dark:text-blue-400"; // number, boolean, null
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-gray-800 dark:text-gray-300 font-semibold"; // key
          } else {
            cls = "text-green-600 dark:text-green-400"; // string
          }
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
    
    return (
      <div
        className="overflow-auto font-mono text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-md max-h-96"
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
