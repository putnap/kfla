import * as React from 'react';

export const Loader: React.FC<{ text?: string }> = props => {
    return <div className='row vertical-center loader'>
        <div className='col text-center'>
            <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            {props.text &&
                <p className='mx-2'>
                    {props.text}
                </p>
            }
        </div>
    </div>
}
