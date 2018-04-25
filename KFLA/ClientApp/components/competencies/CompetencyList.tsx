import * as React from 'react';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';

interface CompetencyListProps {
    competencies: Competency[]
}

interface CompetencyListPropsState {
    evaluations: Evaluation[]
}

export class CompetencyList extends React.Component<CompetencyListProps, CompetencyListPropsState> {

    constructor() {
        super();

        this.state = {
            evaluations: [new Evaluation('Evaluation 1', 10), new Evaluation('Evaluation 2', 12), new Evaluation('Evaluation 3', 11)]
        };
    }

    render() {
        return (
            <section>
                <div className='row mb-2 sticky-top bg-secondary' style={{ top: '72px', background: '#fff' }}>
                    {
                        this.state.evaluations.map(evaluation => {
                            return <div className='col' key={evaluation.Name} >
                                <div className='border border-dark p-3 m-2 bg-light text-dark'>
                                    <span className='p-3'>{evaluation.Name}</span>
                                    <span className='badge badge-dark'>{evaluation.Competencies.length}/{evaluation.Limit}</span>
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className='row'>
                    {
                        this.props.competencies.map(competency => {
                            return <div className='col-4' key={competency.ID}>
                                <div className='border border-dark m-2'>
                                    <div className='p-3'>
                                        <span>{competency.ID}</span>
                                        <span className='pl-3'>{competency.Name}</span>
                                    </div>
                                    <div className='p-3'>
                                        <span>{competency.Description}</span>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </section>
        )
    }

}