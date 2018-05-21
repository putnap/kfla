import * as React from 'react';
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
        return <div className='row m-1'>
            {
                this.props.factors.map(factor => {
                    return <div className='col-3 p-1'>
                        <div className='bg-white p-3 h-100'>
                            <h3 className='color-dark font-weight-bold mb-2'>{factor.Name}</h3>
                            {
                                factor.Clusters.map(cluster => {
                                    return <div className='mb-4'>
                                        <h5 className='color-dark font-weight-bold'>{cluster.Name}</h5>
                                        {
                                            cluster.Competencies.map(renderCall)
                                        }
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