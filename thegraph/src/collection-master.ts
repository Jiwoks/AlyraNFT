import { CollectionCreated, ItemPriceChanged, Bought } from '../generated/CollectionMaster/CollectionMaster';
import { Collection } from '../generated/templates'
import {Collection as CollectionEntity, Event, NFTItem as NFTItemEntity} from '../generated/schema'
import {DataSourceContext} from "@graphprotocol/graph-ts";

export function handleCollectionCreated(event: CollectionCreated): void {
  // Create a new datasource from the new collection
  let context = new DataSourceContext();
  context.setString('name', event.params.name);
  context.setString('symbol', event.params.symbol);
  context.setString('description', event.params.description);
  Collection.createWithContext(event.params.collectionAddress, context);

  // Save the new collection
  const collection = new CollectionEntity(event.params.collectionAddress);
  collection.owner = event.transaction.from;
  collection.name = event.params.name;
  collection.symbol = event.params.symbol;
  collection.description = event.params.description;
  collection.save();
}

export function handleItemPriceChanged(event: ItemPriceChanged): void {
  let nft = NFTItemEntity.load(event.params.collectionAddress.toHexString() + '-' + event.params.tokenId.toString());
  if (nft !== null) {
    nft.price = event.params.priceAfter;
    nft.save();
  }
}

export function handleBought(event: Bought): void {
  const e = new Event(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  e.name = 'Bought';
  e.from = event.params.previousOwner;
  e.to = event.params.newOwner;
  e.price = event.params.price;
  e.transactionId = event.transaction.hash
  e.save();
}
