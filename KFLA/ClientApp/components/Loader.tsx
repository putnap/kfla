import * as React from 'react';

export class Loader extends React.Component<{}, {}> {
    public render() {
        return <div className='row'>
            <div className='col text-center'>
                <span>Loading data...</span>
            </div>
        </div>  
    }
}
