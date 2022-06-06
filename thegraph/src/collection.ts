import {Minted, OwnershipTransferred, Transfer} from '../generated/templates/Collection/Collection';
import {NFTItem, Collection, Event} from '../generated/schema';
import {Address} from "@graphprotocol/graph-ts";

export function handleMinted(event: Minted): void {
  let nft = new NFTItem(event.address.toHexString() + '-' + event.params.tokenId.toString());
  nft.tokenId = event.params.tokenId;
  nft.owner = event.params.from;
  nft.uri = event.params.uri;
  nft.collection = event.address;
  nft.save();

  // let nftId = event.address.toHex() + '-' + event.params.tokenId.toString();
  // const collection = Collection.load(event.address.toHex());
  // if (collection !== null && nftId !== null) {
  //   let nfts = collection.NFTs;
  //   nfts.push(nftId);
  //   collection.NFTs = nfts;
  //   collection.save();
  // }

  const e = new Event(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  e.name = 'Minted';
  e.from = new Address(0);
  e.to = event.params.from;
  e.transactionId = event.transaction.hash
  e.save();
}

export function handleTransfer(event: Transfer): void {
  let nft = NFTItem.load(event.address.toHexString() + '-' + event.params.tokenId.toString());
  if (nft === null) {
    return;
  }

  nft.owner = event.params.to;
  nft.save();

  const e = new Event(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  e.name = 'Transfer';
  e.from = event.params.from;
  e.to = event.params.to;
  e.transactionId = event.transaction.hash
  e.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const collection = Collection.load(event.address);
  if (collection !== null && event.params.newOwner !== null) {
    collection.owner = event.params.newOwner;
    collection.save();
  }
}
