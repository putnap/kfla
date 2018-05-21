import * as React from 'react';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div className='container-fluid'>
            <div id='react-no-print'>
                { this.props.children }
            </div>
            <div className='contentContainer background-light height-100 p-0' id='react-print'></div>
        </div>;
    }
}
