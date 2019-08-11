import * as React from 'react';
import * as jQuery from 'jquery';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { useDrop } from "react-dnd";
import { CompetencyStore } from '../../stores/CompetencyStore';

interface EvaluationItemProps {
    evaluation: Evaluation,
    competencyStore?: CompetencyStore
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

const DropableEvaluationItem: React.FunctionComponent<{ evaluation: Evaluation }> = props => {
    const { evaluation } = props;
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'Competency',
        drop: () => props.evaluation,
        canDrop: () => evaluation.Competencies.length < evaluation.Limit,
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    return (
        <div ref={drop} className='row m-0 bg-white' style={{ borderTopLeftRadius: '25px', border: '1px solid rgba(0,0,0,.125)', position: 'relative', minHeight: '100%', zIndex: 1 }} >
            {props.children}
            {isOver && !canDrop && renderOverlay('red')}
            {!isOver && canDrop && renderOverlay('yellow')}
            {isOver && canDrop && renderOverlay('green')}
        </div>);
}

@inject("competencyStore")
@observer
export class EvaluationItem extends React.Component<EvaluationItemProps, {}> {

    componentDidMount() {
        jQuery('[data-toggle="tooltip"]').tooltip({ trigger: 'hover', placement: 'auto' });
    }

    componentDidUpdate() {
        jQuery('[data-toggle="tooltip"]').tooltip({ trigger: 'hover', placement: 'auto' });
    }

    removeCompetencyFromEvaluation(competency: Competency) {
        this.props.evaluation.removeCompetency(competency);
    }

    render() {
        return <div className='col-4 text-dark'>
            <DropableEvaluationItem evaluation={this.props.evaluation}>
                <div className='col align-self-center' style={{ color: this.props.evaluation.Color }} data-toggle='tooltip' title={this.props.evaluation.Tooltip}>
                    <FontAwesomeIcon icon={this.props.evaluation.Icon} className='mx-2' />
                    <span className='font-weight-bold text-uppercase'>{this.props.evaluation.Name}</span>
                    <span className='font-weight-bold color-dark float-right'>{this.props.evaluation.evaluatedCompetences}/{this.props.evaluation.Limit}</span>
                </div>
                <button type="button" className='btn dropdown-toggle-split rounded-0 background-dark' style={{ width: '75px', height: '60px' }} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' disabled={this.props.evaluation.evaluatedCompetences == 0}>
                    <FontAwesomeIcon icon='sort-down' style={{ fontSize: '150%' }} className='align-self-center text-white' />
                </button>
                <div className='dropdown-menu dropdown-menu-right container m-0 p-0 pb-1 rounded-0 border-0 background-dark'>
                    {
                        this.props.evaluation.Competencies.map(competency => {
                            return <div className='mt-1' key={competency.ID} >
                                <div className='row'>
                                    <div className='col my-1'>
                                        <span className='dropdown-item-text text-white'>{competency.ID}. {competency.Name}</span>
                                    </div>
                                    <div className='col-1'>
                                        <button type='button' className='btn ml-3 float-right' style={{ background: 'none', width: '75px' }} onClick={(e) => this.removeCompetencyFromEvaluation(competency)}>
                                            <FontAwesomeIcon icon='times' className='text-white' style={{ fontSize: '150%' }} />
                                        </button>
                                    </div>
                                    <div className='clearfix'></div>
                                </div>
                            </div>;
                        })
                    }
                </div>
            </DropableEvaluationItem>
        </div>
    }
}