﻿import * as React from 'react';
import { observer } from 'mobx-react';
import { Factor } from "../models/Factor";
import { Competency } from '../models/Competency';

interface FactorListProps {
    factors: Factor[];
    renderCompetency: (competency: Competency) => JSX.Element;
    animate: boolean;
}

@observer
export class FactorList extends React.Component<FactorListProps> {
    getClassNames() {
        var classes = 'row m-1';
        if (this.props.animate)
            classes += 'animate-bottom';

        return classes;
    }

    public render() {
        const renderCall = this.props.renderCompetency;
        return <div className='row'>
            {
                this.props.factors.map(factor => {
                    return <div className='col-3 card mb-2'>
                        <div className='card-body'>
                            <h3 className='card-title font-weight-bold'>{factor.Name}</h3>
                            {
                                factor.Clusters.map(cluster => {
                                    return <div className='row mb-3'>
                                        <div className='col'>
                                            <h5 className='font-weight-bold'>{cluster.Name}</h5>
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