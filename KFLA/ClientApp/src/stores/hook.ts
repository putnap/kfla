import React from 'react';
import { Stores } from './Stores';
import { storeContext } from '../context';

export const useStore = <Store>(storeSelector: (contextData: Stores) => Store) => {
    const value = React.useContext(storeContext);
    if (!value) {
        throw new Error('You have forgot to use StoreProvider, shame on you.')
    }
    return storeSelector(value);
}