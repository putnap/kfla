import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Factor } from "../models/Factor";
import { Competency } from '../models/Competency';
import { LocalizationStore } from '../stores/LocalizationStore';

interface FactorListProps {
    factors: Factor[];
    renderCompetency: (competency: Competency) => JSX.Element;
    animate: boolean;
    localizationStore?: LocalizationStore
}

@inject("localizationStore")
@observer
export class FactorList extends React.Component<FactorListProps> {
    getClassNames() {
        var classes = 'row';
        if (this.props.animate)
            classes += ' animate-bottom';

        return classes;
    }

    public render() {
        const renderCall = this.props.renderCompetency;
        return <div className={this.getClassNames()} >
            {
                this.props.factors.map(factor => {
                    return <div className='col-sm-12 col-md-6 col-xl-3 card mb-2' key={factor.Name}>
                        <div className='card-body p-2 p-md-3'>
                            <h3 className='card-title font-weight-bold'>{this.props.localizationStore.getString('Factor')} {factor.ID}: {factor.Name}</h3>
                            {
                                factor.Clusters.map(cluster => {
                                    return <div className='row mb-3' key={cluster.Name}>
                                        <div className='col'>
                                            <h5 className='font-weight-bold'>{this.props.localizationStore.getString('Cluster')} {cluster.ID} - {cluster.Name}</h5>
                                            {
                                                cluster.Competencies.map(renderCall)
                                            }
                                        </div>
                                    </div>;
                                })
                            }
                        </div>
                    </div>;
                })
            }
        </div>
    }
}