﻿import * as React from 'react';
import { Stopper } from '../../models/Stopper';
import { observer } from 'mobx-react-lite';

export const SelectableStopperItem: React.FC<{ stopper: Stopper }> = observer(props => {
    const stopper = props.stopper;

    return <div key={stopper.Name}>
        <div className='row p-1'>
            <div className='col-1 p-0 align-self-center'>
                <label className='check-container'>
                    <input type='checkbox' checked={stopper.IsSelected} onClick={(e) => stopper.toggleSelection()} />
                    <span className='checkmark'></span>
                </label>
            </div>
            <div className='col-1 p-0 text-right'>
                <span>{stopper.ID}.</span>
            </div>
            <div className='col'>
                <p className='font-weight-bold'>{stopper.Name}</p>
            </div>
        </div>
    </div>
})


