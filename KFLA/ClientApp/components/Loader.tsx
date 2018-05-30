import * as React from 'react';

export interface LoaderProps {
    text?: string;
}

export class Loader extends React.Component<LoaderProps, {}> {
    public render() {
        return <div className='row vertical-center loader'>
            <div className='col text-center'>
                <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                
                <p className='mx-2'>
                    {this.props.text}
                </p>
            </div>
        </div>  
    }
}
