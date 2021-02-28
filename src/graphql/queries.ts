import { gql } from '@apollo/client'

export const GET_PARCEL_NFTS = gql`
  query NFTs($first: Int, $skip: Int, $orderBy: String, $orderDirection: String, $expiresAt: String, $address: String, $category: Category, $wearableCategory: WearableCategory, $isLand: Boolean, $isWearableHead: Boolean, $isWearableAccessory: Boolean) {
    nfts(where: { searchEstateSize_gt: 0, searchParcelIsInBounds: true, category: $category, searchOrderStatus: open, searchOrderExpiresAt_gt: $expiresAt }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...nftFragment
      __typename
    }
  }

  fragment nftFragment on NFT {
    ...nftFields
    activeOrder(size_gt: 0) {
      ...orderFields
      __typename
    }
    __typename
  }

  fragment nftFields on NFT {
    id
    name
    image
    contractAddress
    tokenId
    category
    owner {
      address
      __typename
    }
    parcel {
      x
      y
      data {
        description
        __typename
      }
      __typename
    }
    estate {
      size
      parcels {
        x
        y
        __typename
      }
      data {
        description
        __typename
      }
      __typename
    }
    wearable {
      description
      category
      rarity
      bodyShapes
      __typename
    }
    ens {
      subdomain
      __typename
    }
    __typename
  }

  fragment orderFields on Order {
    id
    category
    nftAddress
    owner
    buyer
    price
    status
    expiresAt
    createdAt
    updatedAt
    __typename
  }
`



