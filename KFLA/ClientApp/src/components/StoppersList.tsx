import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Stopper } from '../models/Stopper';
import { useStore } from '../stores/hook';

interface StoppersListProps {
    renderStopper: (stopper: Stopper) => JSX.Element;
    animate: boolean;
}

const getClassNames = (animate) => {
    var classes = 'row mb-2';
    if (animate)
        classes += ' animate-bottom';

    return classes;
}

export const StoppersList: React.FC<StoppersListProps> = observer(props => {

    const { localizationStore, stoppersStore } = useStore(stores => stores);
    const { renderStopper, animate } = props;

    return <div className={getClassNames(animate)} >
        <div className='col card bg-light w-100'>
            <div className='card-body p-2 p-md-3'>
                <h4 className='font-weight-bold'>{localizationStore.getString("Stoppers.Title")}</h4>
                <div className='row'>
                    {
                        stoppersStore.stopperClusters.map(stopperCluster => {
                            return <div className='col-lg-12 col-xl-4 mb-2' key={stopperCluster.ID}>
                                <h5 className='font-weight-bold'>{stopperCluster.Name}</h5>
                                {
                                    stopperCluster.Stoppers.map(stopper => {
                                        return renderStopper(stopper);
                                    })
                                }
                            </div>;
                        })
                    }
                </div>
            </div>
        </div>
    </div>
})
