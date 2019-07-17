import * as React from 'react';
import { Stopper } from '../../models/Stopper';
import { inject } from 'mobx-react';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface StopperItemProps {
    stopper: Stopper;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class StopperItem extends React.Component<StopperItemProps, {}> {

    render() {
        return <div className='row'>
            <div className='col p-1'>
                <span>{this.props.stopper.ID}.</span>
                <span className='font-weight-bold ml-3'>{this.props.stopper.Name}</span>
            </div>
        </div>
    }
}


