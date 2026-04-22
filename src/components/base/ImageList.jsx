"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getImageURL, fetchModel } from '../../utils/fetchData';
import Loading from './Loading';
import './ImageList.scss';

const findFirstImage = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const resourceType = obj["sling:resourceType"] || obj[":type"];
    if (resourceType === "wknd/components/image") return obj;
    
    const items = obj[":items"];
    if (items) {
        for (const key in items) {
            const found = findFirstImage(items[key]);
            if (found) return found;
        }
    }
    return null;
};

const ImageListItem = ({ item }) => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const path = item.path;

    useEffect(() => {
        if (!path) {
            setLoading(false);
            return;
        }
        fetchModel(path).then((data) => {
            setModel(data);
            setLoading(false);
        }).catch((err) => {
            console.error("Error fetching item model:", err);
            setLoading(false);
        });
    }, [path]);

    if (loading) return <div className="cmp-imagelist__item-loading"><Loading /></div>;
    if (!model) return null;

    const title = model["jcr:title"] || model["title"] || item.title;
    const description = model["jcr:description"] || model["description"] || item.description;
    
    // Recursively find the first image component starting from the root container
    const rootContainer = model[":items"]?.root?.[":items"]?.container;
    const imageItem = findFirstImage(rootContainer);
    const imagePath = imageItem?.fileReference || imageItem?.src || imageItem?.file;

    const linkUrl = item.link?.url || (path ? `${path}.html` : "#");

    return (
        <div className="cmp-imagelist__item" data-aue-resource={`urn:aemconnection:${path}/jcr:content`} data-aue-component="image-list-item" data-aue-type="component" data-aue-label="Image List Item">
            <Link href={linkUrl} className="cmp-imagelist__item-link">
                <div className="cmp-imagelist__item-image">
                    {imagePath ? (
                        <img src={getImageURL(imagePath)} alt={title} />
                    ) : (
                        <div className="cmp-imagelist__item-image-placeholder" />
                    )}
                </div>
                <div className="cmp-imagelist__item-content">
                    <h3 className="cmp-imagelist__item-title" data-aue-label="Title" data-aue-prop="jcr:title" data-aue-type="text">{title}</h3>
                    {description && <p className="cmp-imagelist__item-description" data-aue-label="Description" data-aue-prop="jcr:description" data-aue-type="text">{description}</p>}
                </div>
            </Link>
        </div>
    );
};

const ImageList = (props) => {
    const { resource, type, data } = props;
    const items = data?.items || [];

    return (
        <div className="cmp-imagelist" data-aue-component="image-list" data-aue-resource={resource} data-aue-type={type} data-aue-label="Image List" data-aue-prop="pages">
            <div className="cmp-imagelist__items">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <ImageListItem key={index} item={item} />
                    ))
                ) : (
                    <div className="cmp-imagelist__empty">Image List (Empty)</div>
                )}
            </div>
        </div>
    );
};

export default ImageList;
