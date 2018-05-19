import * as React from 'react';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div className='container-fluid px-0'>
            <div id='react-no-print'>
                { this.props.children }
            </div>
            <div id='react-print'></div>
        </div>;
    }
}
