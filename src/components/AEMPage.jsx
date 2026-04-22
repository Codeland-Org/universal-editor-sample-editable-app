"use client";
import React, { useEffect, useState } from 'react';
import { fetchModel } from '../utils/fetchData';
import Container from './base/Container';
import Loading from './base/Loading';

const AEMPage = ({ path, children }) => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AEMPage: fetching model for path:", path);
        if (!path) return;
        
        setLoading(true);
        fetchModel(path).then((data) => {
            console.log("AEMPage: fetched model:", data);
            setModel(data);
            setLoading(false);
        }).catch((err) => {
            console.error("AEMPage: Error fetching model:", err);
            setLoading(false);
        });
    }, [path]);

    if (loading) return <Loading />;
    if (!model) {
        console.log("AEMPage: No model found for path", path);
        return children || null;
    }

    const rootData = model[":items"]?.root || model;
    if (rootData === model && !model[":items"]) {
        console.warn("AEMPage: Model has no items, might be an empty page or wrong path.");
    }

    // The root of a page model is usually a container or has :items
    return (
        <div className="aem-page">
            <Container 
                resource={`urn:aemconnection:${path}/jcr:content/root`} 
                data={model[":items"]?.root || model} 
                type="container" 
                label="Page Root"
            />
        </div>
    );
};

export default AEMPage;
