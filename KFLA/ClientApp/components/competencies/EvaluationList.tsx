import * as React from 'react';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { render } from 'react-dom';
import { EvaluationItem } from './EvaluationItem';

interface EvaluationListProps {
    evaluations: Evaluation[]
}

export class EvaluationList extends React.Component<EvaluationListProps, {}> {

    render() {
        return (
            <div className='row pb-2 sticky-top background-light px-5' style={{ top: '72px' }}>
                {
                    this.props.evaluations.map(evaluation => {
                        return <EvaluationItem evaluation={evaluation} key={evaluation.Name}/>
                    })
                }
            </div>
        )
    }
}