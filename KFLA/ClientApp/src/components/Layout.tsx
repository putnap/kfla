import * as React from 'react';

export const Layout: React.FC<{}> = props => {
    return <div className='container-fluid'>
            {props.children}
        </div>;
}
