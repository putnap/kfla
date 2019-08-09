import * as React from 'react';
import ScrollToTop from './ScrollToTop';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <ScrollToTop>
            <div className='container-fluid'>
                {this.props.children}
            </div>
        </ScrollToTop>;
    }
}
