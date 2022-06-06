import React from "react";
import './Collections.css';
import {latestCollectionsQuery, latestUserCollectionsQuery} from "../../../helpers/graph";
import CollectionItem from "../CollectionItem/CollectionItem";
import {useQuery} from "@apollo/client";

function Collections({type, title, emptyText}) {
    let query;
    if (type === 'user') {
        query = latestUserCollectionsQuery;
    } else {
        query = latestCollectionsQuery
    }
    const { loading, error, data } = useQuery(query);

    return (
        <div className="Collections">
            <h1>{title}</h1>
            <div className="CollectionsItems">
                {!loading && !error && data.collections.length === 0 && <>{emptyText}</>}
                {!loading && !error && data.collections.map((collection) => {
                    return (
                        <CollectionItem key={collection.id} collection={collection} />
                    )
                })}
            </div>
        </div>
    );
}

export default Collections;
