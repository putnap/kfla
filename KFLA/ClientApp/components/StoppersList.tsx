import * as React from 'react';
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Loader } from './Loader';
import { StoppersStore } from '../stores/StoppersStore';
import { Stopper } from '../models/Stopper';
import { LocalizationStore } from 'ClientApp/stores/LocalizationStore';

interface StoppersListProps {
    stoppersStore?: StoppersStore;
    localizationStore?: LocalizationStore;
    renderStopper: (stopper: Stopper) => JSX.Element;
    animate: boolean;
}

@inject("stoppersStore", "localizationStore")
@observer
export class StoppersList extends React.Component<StoppersListProps, {}> {

    componentDidMount() {
        const store = this.props.stoppersStore;
        if (!store!.isLoaded)
            store!.fetchStoppers();
    }

    getClassNames() {
        var classes = 'row mb-2';
        if (this.props.animate)
            classes += ' animate-bottom';

        return classes;
    }

    render() {
        const store = this.props.stoppersStore!;
        return store.isLoading ? <Loader text={this.props.localizationStore.getString("Stoppers.Loading")} />
            :
            (<div className={this.getClassNames()} >
                <div className='col card bg-light w-100'>
                    <div className='card-body p-2 p-md-3'>
                        <h4 className='font-weight-bold'>{this.props.localizationStore.getString("Stoppers.Title")}</h4>
                        <div className='row'>
                            {
                                store.stopperClusters.map(stopperCluster => {
                                    return <div className='col-lg-12 col-xl-4 mb-2' key={stopperCluster.ID}>
                                        <h5 className='font-weight-bold'>{stopperCluster.Name}</h5>
                                        {
                                            stopperCluster.Stoppers.map(stopper => {
                                                return this.props.renderStopper(stopper);
                                            })
                                        }
                                    </div>;
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>)
    }

}
