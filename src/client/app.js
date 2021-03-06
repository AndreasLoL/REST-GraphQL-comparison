import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter,
    Route
} from 'react-router-dom'
import './App.css';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import ComparisonPage from "./containers/ComparisonPage";

export const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: 'http://localhost:3000/graphql',
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
            },
        }
    }),
});

const App = () => (
    <ApolloProvider client={client}>
        <BrowserRouter>
            <div>
                <Route path="/" component={ComparisonPage}/>
            </div>
        </BrowserRouter>
    </ApolloProvider>
);

render(
    <App />
, document.getElementById('app'));
