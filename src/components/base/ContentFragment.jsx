import React from 'react';
import { mapJsonRichText } from '../../utils/renderRichText';
import { getImageURL } from '../../utils/fetchData';
import '../AdventureDetail.scss';

const ContentFragment = ({ resource, type, data }) => {
  // AEM headless usually returns fragment data under "elements" or "model"
  const elements = data?.elements || data;

  if (!elements) {
    return <div className="content-fragment empty">Empty Content Fragment</div>;
  }

  const fragmentPath = data?.fragmentPath;
  const cfResource = fragmentPath ? `urn:aemconnection:${fragmentPath}/jcr:content/data/master` : null;

  const isArticle = data?.model === 'wknd-shared/models/article';

  // Generic renderer for CF elements
  return (
    <div 
      className="content-fragment" 
      data-aue-resource={resource} 
      data-aue-type={type}
      data-aue-model="contentfragment"
      data-aue-label="Content Fragment"
      style={{ padding: '15px', border: '1px solid #eee', marginBottom: '15px' }}
    >
      <div 
        className={`content-fragment-elements ${isArticle ? 'adventure-detail' : ''}`}
        data-aue-resource={cfResource}
        data-aue-type={cfResource ? "reference" : undefined}
        data-aue-filter="cf"
        data-aue-label="Article"
      >
        {isArticle ? (
          <>
            <div className="adventure-detail-header" style={{ padding: '0 1rem' }}>
              {elements.title && (
                <h1 className="adventure-detail-title" data-aue-prop="title" data-aue-type="text" data-aue-label="Title">
                  {elements.title.value || elements.title}
                </h1>
              )}
            </div>
            <div>
              {(elements.featuredImage || elements.primaryImage) && (
                <img 
                  className="adventure-detail-primaryimage" 
                  data-aue-type="media" 
                  data-aue-prop={elements.featuredImage ? "featuredImage" : "primaryImage"}
                  src={`${getImageURL((elements.featuredImage || elements.primaryImage).value || (elements.featuredImage || elements.primaryImage))}`} 
                  alt={(elements.title?.value || elements.title) || 'Article Image'}
                />
              )}
              <div className="adventure-detail-content">
                {elements.main && (
                  <div data-aue-prop="main" data-aue-type="richtext">
                    {elements.main.html ? (
                      <div dangerouslySetInnerHTML={{ __html: elements.main.html }} />
                    ) : elements.main.json ? (
                      mapJsonRichText(elements.main.json)
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: elements.main.value || elements.main }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          Object.keys(elements).map(key => {
            const element = elements[key];
            if (!element || typeof element !== 'object') return null;

            const aueType = (element.html || element.json) ? "richtext" : "text";

            // Check if it's a rich text or simple text
            if (element.html) {
              return <div key={key} data-aue-prop={key} data-aue-type={aueType} dangerouslySetInnerHTML={{ __html: element.html }} />;
            } else if (element.json) {
              return <div key={key} data-aue-prop={key} data-aue-type={aueType}>{mapJsonRichText(element.json)}</div>;
            } else if (element.value) {
              return <div key={key} data-aue-prop={key} data-aue-type={aueType} className={`cf-element cf-${key}`}>{element.value}</div>;
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default ContentFragment;
