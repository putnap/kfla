import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { Stores } from './stores/Stores';

export const storeContext = React.createContext<Stores | null>(null);

export const StoreProvider: React.FunctionComponent<{ createStores: () => Stores }> = props => {
    const store = useLocalStore(props.createStores);

    return (
        <storeContext.Provider value={store}>
            {props.children}
        </storeContext.Provider>
    );
};

export default StoreProvider;