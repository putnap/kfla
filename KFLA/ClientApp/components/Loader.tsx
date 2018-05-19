import * as React from 'react';

export class Loader extends React.Component<{}, {}> {
    public render() {
        return <div className='row vertical-center'>
            <div className='col text-center'>
                <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>  
    }
}
