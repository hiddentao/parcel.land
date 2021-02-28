import React, { useState, useMemo, useEffect } from 'react'
import EthVal from 'ethval'
import { useLazyQuery } from '@apollo/client'
import _ from 'lodash'

import { GET_PARCEL_NFTS } from '../graphql/queries'
import { formatDistanceToNow } from 'date-fns'


interface ParcelListProps {
  nfts: any,
}

const ParcelList: React.FunctionComponent<ParcelListProps> = ({ nfts }) => {
  const final = useMemo(() => {
    const filtered: any = (nfts as any[]).reduce((m, n) => {
      if (_.get(n, 'activeOrder.status') === 'open') {
        const n2: any = _.pick(n, 'id', 'name', 'image', 'tokenId', 'contractAddress')
        _.extend(n2, _.pick(n.activeOrder, 'owner', 'nftAddress'))
        _.extend(n2, _.pick(n.estate, 'size', 'parcels', 'description'))
        n2.expiresAt = new Date(parseInt(n.activeOrder.expiresAt, 10))
        n2.price = new EthVal(n.activeOrder.price)
        n2.unitPrice = n2.price.div(n2.size)
        m[n.id] = n2
      }
      return m
    }, {})

    const sorted = Object.values(filtered).sort((a: any, b: any) => {
      return a.unitPrice.lt(b.unitPrice) ? -1 : 1
    })

    return sorted
  }, [ nfts ])

  return (
    <table cellPadding={5} cellSpacing={5}>
      <thead>
        <th>Image</th>
        <th>Name / Desc</th>
        <th>Size</th>
        <th>Total cost</th>
        <th>Unit cost</th>
        <th>Expires</th>
        <th>Actions</th>
      </thead>
      <tbody>
        {final.map((f: any) => (
          <tr key={f.id}>
            <td>
              <img width="64" height="64" src={f.image} />
            </td>
            <td>
              <p>{f.name}</p>
              <p>{f.description}</p>
            </td>
            <td>
              {f.size}
            </td>
            <td>
              {f.price.toEth().toString()}
            </td>
            <td>
              {f.unitPrice.toEth().toFixed(2)}
            </td>
            <td>
              <span title={f.expiresAt.toString()}></span>{formatDistanceToNow(f.expiresAt, { addSuffix: true })}
            </td>
            <td>
              <a target="_blank" href={`https://market.decentraland.org/contracts/${f.contractAddress}/tokens/${f.tokenId}`}>↗️</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


const Bootstrap = () => {
  const [ executeQuery, { error, data }] = useLazyQuery(GET_PARCEL_NFTS, { fetchPolicy: 'network-only' })

  useEffect(() => {
    executeQuery({
      variables: {
        "first": 1000,
        "skip": 0,
        "orderBy": "searchOrderCreatedAt",
        "orderDirection": "desc",
        "onlyOnSale": true,
        "category": "estate",
        "isLand": false,
        "isWearableHead": false,
        "isWearableAccessory": false,
        "expiresAt": `${new Date().getTime()}`
      },
    })
  }, [])

  if (error) {
    return <p>Error: {error}</p>
  } else if (data) {
    return (
      <ParcelList nfts={data.nfts} />
    )
  } else {
    return <p>Loading ...</p>
  }
}

export default Bootstrap
