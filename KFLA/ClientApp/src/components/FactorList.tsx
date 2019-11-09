import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Factor } from "../models/Factor";
import { Competency } from '../models/Competency';
import { useStore } from '../stores/hook';

interface FactorListProps {
    factors: Factor[];
    renderCompetency: (competency: Competency) => JSX.Element;
    animate: boolean;
}

const getClassNames = (animate) => {
    var classes = 'row';
    if (animate)
        classes += ' animate-bottom';

    return classes;
}

export const FactorList: React.FC<FactorListProps> = observer(props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { factors, renderCompetency, animate } = props;
    return <div className={getClassNames(animate)} >
        {
            factors.map(factor => {
                return <div className='col-sm-12 col-md-6 col-xl-3 card mb-2' key={factor.Name}>
                    <div className='card-body p-2 p-md-3'>
                        <h3 className='card-title font-weight-bold'>{localizationStore.getString('Factor')} {factor.ID}: {factor.Name}</h3>
                        {
                            factor.Clusters.map(cluster => {
                                return <div className='row mb-3' key={cluster.Name}>
                                    <div className='col'>
                                        <h5 className='font-weight-bold'>{localizationStore.getString('Cluster')} {cluster.ID} - {cluster.Name}</h5>
                                        {
                                            cluster.Competencies.map(renderCompetency)
                                        }
                                    </div>
                                </div>;
                            })
                        }
                    </div>
                </div>;
            })
        }
        </div >
})