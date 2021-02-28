import React from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

import Bootstrap from './components/Bootstrap'

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
  cache: new InMemoryCache()
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Bootstrap />
    </ApolloProvider>
  )
}

export default App
