import React from "react";

interface Props {
  header: React.ReactNode;
  extra?: React.ReactNode;
}
const ContentGroup: React.FC<Props> = ({ header, extra, children }) => {
  return (
    <div className="ct-content-group">
      {header && (
        <div className="ct-content-group__header">
          <div className="ct-content-group__header-content">{header}</div>
          {extra && (
            <div className="ct-content-group__header-extra">{extra}</div>
          )}
        </div>
      )}
      <div className="ct-content-group__content">{children}</div>
    </div>
  );
};

export default ContentGroup;
