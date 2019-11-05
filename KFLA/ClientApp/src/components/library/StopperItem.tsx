import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Stopper } from '../../models/Stopper';
import { observer, inject } from 'mobx-react';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface StopperItemProps extends Partial<RouteComponentProps<{}>>{
    stopper: Stopper;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class StopperItem extends React.Component<StopperItemProps, {}> {

    constructor(props: StopperItemProps) {
        super(props);

        this.openStopper = this.openStopper.bind(this);
    }

    openStopper(stopperId: number) {
        const { match } = this.props;
        this.props.history.push(`${match.url}/stoppers/${stopperId}`);
    }

    render() {
        const { stopper } = this.props;
        return <div className='row'>
            <div className='col competency-as-button p-1 pointer' onClick={() => this.openStopper(stopper.ID)}>
                <span>{stopper.ID}.</span>
                <span className='font-weight-bold ml-3'>{stopper.Name}</span>
            </div>
        </div>
    }
}


