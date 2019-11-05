import * as React from 'react';
import * as jQuery from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrop } from "react-dnd";
import { observer } from 'mobx-react-lite';
import { Evaluation } from '../../models/Evaluation';

interface EvaluationItemProps {
    evaluation: Evaluation
}

const renderOverlay = (color: string) => {
    return (
        <div style={{
            position: 'absolute',
            display: 'inline-block',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 2,
            opacity: 0.3,
            backgroundColor: color,
            borderTopLeftRadius: '25px',
        }} />
    );
}

const DropableEvaluationItem = ({ evaluation, children }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'Competency',
        drop: () => evaluation,
        canDrop: () => evaluation.Competencies.length < evaluation.Limit,
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    return <div ref={drop} className='row m-0 bg-white' style={{ borderTopLeftRadius: '25px', border: '1px solid rgba(0,0,0,.125)', position: 'relative', minHeight: '100%', zIndex: 1 }}>
        {children}
        {isOver && !canDrop && renderOverlay('red')}
        {!isOver && canDrop && renderOverlay('yellow')}
        {isOver && canDrop && renderOverlay('green')}
    </div>
}

const EvaluatedCompetencyItem = ({ competency }) => {
    return <div className='mt-1' key={competency.ID} >
        <div className='row'>
            <div className='col my-1'>
                <span className='dropdown-item-text text-white'>{competency.ID}. {competency.Name}</span>
            </div>
            <div className='col-1'>
                <button type='button' className='btn ml-3 float-right' style={{ background: 'none', width: '75px' }} onClick={(e) => competency.evaluateCompetency()}>
                    <FontAwesomeIcon icon='times' className='text-white' style={{ fontSize: '150%' }} />
                </button>
            </div>
            <div className='clearfix'></div>
        </div>
    </div>
}

export const EvaluationItem: React.FunctionComponent<EvaluationItemProps> = observer(props => {
    React.useEffect(() => {
        jQuery('[data-toggle="tooltip"]').tooltip({ trigger: 'hover', placement: 'auto' });
    });
    const { evaluation } = props;

    return <div className='col-4 text-dark'>
        <DropableEvaluationItem evaluation={evaluation}>
            <div className='col align-self-center' style={{ color: evaluation.Color }} data-toggle='tooltip' title={evaluation.Tooltip}>
                <FontAwesomeIcon icon={evaluation.Icon} className='mx-2' />
                <span className='font-weight-bold text-uppercase'>{evaluation.Name}</span>
                <span className='font-weight-bold color-dark float-right'>{evaluation.evaluatedCompetences}/{evaluation.Limit}</span>
            </div>
            <button type="button" className='btn dropdown-toggle-split rounded-0 background-dark' style={{ width: '75px', height: '60px' }} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' disabled={evaluation.evaluatedCompetences === 0}>
                <FontAwesomeIcon icon='sort-down' style={{ fontSize: '150%' }} className='align-self-center text-white' />
            </button>
            <div className='dropdown-menu dropdown-menu-right container m-0 p-0 pb-1 rounded-0 border-0 background-dark'>
                {
                    evaluation.Competencies.map((competency, i) => <EvaluatedCompetencyItem competency={competency} key={i} />)
                }
            </div>
        </DropableEvaluationItem>
    </div>
})