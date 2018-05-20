import * as React from 'react';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div>
            <div className='container-fluid' id='react-no-print'>
                { this.props.children }
            </div>
            <div className='container' id='react-print'></div>
        </div>;
    }
}
