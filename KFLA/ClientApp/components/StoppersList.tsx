import * as React from 'react';
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Loader } from './Loader';
import { StoppersStore } from '../stores/StoppersStore';
import { Stopper } from '../models/Stopper';

interface StoppersListProps {
    stoppersStore?: StoppersStore
    renderStopper: (stopper: Stopper) => JSX.Element;
    animate: boolean;
}

@inject("stoppersStore")
@observer
export class StoppersList extends React.Component<StoppersListProps, {}> {

    componentDidMount() {
        const store = this.props.stoppersStore;
        if (!store!.isLoaded)
            store!.fetchStoppers();
    }

    getClassNames() {
        var classes = 'row';
        if (this.props.animate)
            classes += ' animate-bottom';

        return classes;
    }

    render() {
        const store = this.props.stoppersStore!;
        return store.isLoading ? <Loader text='Loading stoppers...' />
            :
            (<div className={this.getClassNames()} >
                <div className='card bg-light w-100'>
                    <div className='card-body'>
                        <h4 className='font-weight-bold'>CAREER STALLERS AND STOPPERS</h4>
                        <div className='row'>
                            {
                                store.stopperTypes.map(stopperType => {
                                    return <div className='col-4 mb-2'>
                                        <h5 className='font-weight-bold'>{stopperType.Name}</h5>
                                        {
                                            stopperType.Stoppers.map(stopper => {
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
