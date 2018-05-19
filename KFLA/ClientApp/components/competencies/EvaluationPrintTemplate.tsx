import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Factor } from '../../models/Factor';

interface EvaluationPrintTemplateProps {
    factors: Factor[]
}

export class EvaluationPrintTemplate extends React.Component<EvaluationPrintTemplateProps, {}> {

    public render() {
        return <section>
            <div className='contentContainer background-light height-100 p-0'>
                <div className='row m-1'>
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
                                                cluster.Competencies.map(competency => {
                                                    return <div className='row' style={{ color: competency.Evaluation.Color }} >
                                                        <div className='col-1 text-right'>
                                                            <span>{competency.ID}.</span>
                                                        </div>
                                                        <div className='col'>
                                                            <div className='font-weight-bold'>{competency.Name}</div>
                                                            <div>{competency.Description}</div>
                                                        </div>
                                                    </div>;
                                                })
                                            }
                                        </div>;
                                    })
                                }
                            </div>
                        </div>;
                    })
                }
                </div>
            </div>
        </section>;
    }
}