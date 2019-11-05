import * as React from 'react';

export const Layout: React.FunctionComponent<{}> = props => {
    return <div className='container-fluid'>
            {props.children}
        </div>;
}
