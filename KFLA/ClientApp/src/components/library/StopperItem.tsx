import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Stopper } from '../../models/Stopper';

interface StopperItemProps extends RouteComponentProps<{}> {
    stopper: Stopper;
}

const StopperItem: React.FC<StopperItemProps> = props => {
    const { stopper, match, history } = props;
    const openStopper = (stopperId: number) => {
        history.push(`${match.url}/stoppers/${stopperId}`);
    };

    return <div className='row'>
        <div className='col competency-as-button p-1 pointer' onClick={() => openStopper(stopper.ID)}>
            <span>{stopper.ID}.</span>
            <span className='font-weight-bold ml-3'>{stopper.Name}</span>
        </div>
    </div>
}

export default withRouter(StopperItem);

