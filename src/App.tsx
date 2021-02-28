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
      <header>
        <p>Decentraland estate per-parcel prices. Made with ❤️ by <a href="https://twitter.com/hiddentao">hiddentao</a>.</p>
      </header>
      <Bootstrap />
    </ApolloProvider>
  )
}

export default App
