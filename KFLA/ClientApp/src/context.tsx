import React from 'react';
import { Stores, createStores } from './stores/Stores';

export const storeContext = React.createContext<Stores | null>(null);

export const StoreProvider: React.FC<{ stores?: Stores }> = props => {

    const stores = props.stores || createStores();

    return (
        <storeContext.Provider value={stores}>
            {props.children}
        </storeContext.Provider>
    );
};

export default StoreProvider;