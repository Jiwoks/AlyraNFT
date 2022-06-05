import React, {useEffect, useState} from "react";
import './Collections.css';
import {getLatestCollections, getUserCollections} from "../../../helpers/contract";
import CollectionItem from "../CollectionItem/CollectionItem";

function Collections({type, title, emptyText}) {
    const [collections, setCollections] = useState(null);

    useEffect(() => {
        (async () => {
            if (type === 'user') {
                const collections = await getUserCollections();
                setCollections(collections);
            } else if (type === 'latest') {
                const collections = await getLatestCollections();
                setCollections(collections);
            }
        })();
    }, []);

    return (
        <div className="Collections">
            <h1>{title}</h1>
            <div className="CollectionsItems">
                {collections !== null && collections.length === 0 && <>{emptyText}</>}
                {collections !== null && collections.map((collection) => {
                    return (
                        <CollectionItem key={collection} collectionId={collection} />
                    )
                })}
            </div>
        </div>
    );
}

export default Collections;
