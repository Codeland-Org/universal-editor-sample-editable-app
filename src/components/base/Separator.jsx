"use client";
import React from 'react';

const Separator = ({ resource, type = "component", className = "", data }) => {
  
  const editorProps = {
    "data-aue-resource": resource,
    "data-aue-type": type,
    "data-aue-label": "Separator"
  };

  return (
    <div {...editorProps} data-aue-component="separator" className={`${className} cmp-separator`}>
      <hr className="cmp-separator__horizontal-rule" style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />
    </div>
  );
};

export default Separator;
