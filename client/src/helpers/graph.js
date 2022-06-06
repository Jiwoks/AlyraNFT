import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
    uri: process.env.REACT_APP_SUBGRAPH_QUERY_URL,
    cache: new InMemoryCache()
});

const latestCollectionsQuery = gql`
    query 
    {
        collections(first: 10) 
        {
          id
          name
          description
          symbol
    }
}`;

const latestUserCollectionsQuery = gql`
    query($owner: String!)
    {
        collections(first: 10, owner: $owner) 
        {
          id
          name
          description
          symbol
    }
}`;

const nftItemsByCollectionQuery = gql`
    query($collection: String!, $first: Int!)
    {
        collection(id: $collection) 
        {
          id
          name
          description
          symbol
          owner
          NFTs(first: $first) {
              id
              tokenId
              owner
              uri
              price
          }
    }
}`;

const nftItemQuery = gql`
    query NFT($collectionId: String!, $tokenId: String!)
    {
        collection(id: $collectionId) {
            id
            name
            description
            NFTs(where: {tokenId: $tokenId}) {
                id
                tokenId
                owner
                uri
                price
            }
        }
        
}`;

export {
    client,
    latestCollectionsQuery,
    latestUserCollectionsQuery,
    nftItemsByCollectionQuery,
    nftItemQuery
};
