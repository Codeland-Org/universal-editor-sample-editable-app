"use client";
import React from 'react';
import {fetchData} from '../../utils/fetchData';
import Text from './Text';
import Title from './Title';
import Image from './Image';
import Accordion from './Accordion';
import Teaser from './Teaser';
import ImageList from './ImageList';
import Separator from './Separator';
import ContentFragment from './ContentFragment';

const Container = ({ resource, type, label = "Container", data}) => {
  const [components, setComponents] = React.useState(null);

  const gridClassNames = data?.gridClassNames || "aem-Grid aem-Grid--12 aem-Grid--default--12";
  const columnClassNames = data?.columnClassNames || {};

  const createChildComponents = (items, itemid) => {
    const components = [];
    for(let key in items) {
      const item = items[key];
      if (item === null || typeof item !== 'object') {
        continue;
      }
      const resourceType = item["sling:resourceType"] || item[":type"];
      const type = resourceType?.split("/").pop();
      if (type === undefined) {
        continue;
      }

      let itemType, Component;
      switch(type) {
        case "image": 
          itemType = "media";
          Component = Image;
          break;
        case "text": 
          itemType = item.textIsRich ? "richtext" : "text";
          Component = item.type ? Title : Text;
          break;
        case "title":
            itemType = "text";
            Component = Title;
            break;
        case "accordion":
          itemType = "container";
          Component = Accordion;
          break;
        case "responsivegrid":
        case "container":
          itemType = "container";
          Component = Container;
          break;
        case "experiencefragment":
          itemType = "container";
          Component = Container;
          break;
        case "tabs":
        case "accordion":
          itemType = "container";
          Component = Accordion;
          break;
        case "teaser":
          itemType = "component";
          Component = Teaser;
          break;
        case "image-list":
          itemType = "component";
          Component = ImageList;
          break;
        case "separator":
          itemType = "component";
          Component = Separator;
          break;
        case "contentfragment":
          itemType = "component";
          Component = ContentFragment;
          break;
        case "button":
        case "breadcrumb":
        case "list":
        case "navigation":
          itemType = "component";
          Component = (props) => (
            <div className="placeholder-component" style={{border: '1px dashed #ccc', padding: '10px', margin: '5px'}}>
               {type} ({props.resource})
            </div>
          );
          break;
        default: 
          console.log("Unmapped component type:", type, resourceType);
          itemType = "component";
          Component = (props) => (<div className="unmapped-component">Unmapped: {type} ({props.resource})</div>);
          break;
      }

      const props = {
        resource: `${itemid}/${key}`,
        type: itemType,
        data: item,
      };

      const colClass = columnClassNames[key] || "aem-GridColumn aem-GridColumn--default--12";
      components.push(
        <div key={key} className={colClass}>
          <Component {...props} />
        </div>
      )
    }
    return components;
  }

  React.useEffect(() => {
    if (data) {
      const items = data[":items"] || data;
      setComponents(createChildComponents(items, resource));
      return;
    }
    if(!resource) return;
    fetchData(resource).then((fetchedData) => {
      setComponents(createChildComponents(fetchedData, resource));
    });
  }, [resource, data]);
  
  return (
    <div className={gridClassNames} data-aue-component="container" data-aue-resource={resource} data-aue-type={type} data-aue-label={label}>
     {components}
    </div>
  )
};

export default Container;