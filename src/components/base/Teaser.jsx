"use client";
import React, {useEffect, useMemo} from 'react';
import {fetchData, getImageURL} from '../../utils/fetchData';

const Teaser = (props) => {
  const {resource, type, className, data: initialData} = props;

  const editorProps = useMemo(() => true && {
    "data-aue-resource": resource,
    "data-aue-type": type,
    "data-aue-label": "Teaser"
  }, [resource, type]);

  const [data, setData] = React.useState(initialData || {});
  useEffect(() => {
    if(!resource || initialData) return;
    fetchData(resource).then((data) => setData(data));
  }, [resource, initialData]);

  const imagePath = data?.["fileReference"];

  return (
    <div {...editorProps} data-aue-component="teaser" className={`${className} cmp-teaser`}>
      <div className="cmp-teaser__content">
        {imagePath && (
          <div className="cmp-teaser__image">
            <img 
              data-aue-prop="fileReference" 
              data-aue-type="media" 
              data-aue-label="Image"
              src={getImageURL(imagePath)} 
              alt={data["jcr:title"]} 
              className="cmp-teaser__image-img"
            />
          </div>
        )}
        <div className="cmp-teaser__content-details">
          <h2 data-aue-prop="jcr:title" data-aue-type="text" data-aue-label="Title" className="cmp-teaser__title">
            {data["jcr:title"] || "Teaser Title"}
          </h2>
          <div data-aue-prop="jcr:description" data-aue-type="text" data-aue-label="Description" className="cmp-teaser__description">
            {data["jcr:description"] || "Teaser Description"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teaser;
