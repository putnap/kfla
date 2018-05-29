import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import {
    DropTarget, DropTargetSpec, DropTargetCollector, ConnectDropTarget, DropTargetConnector, DropTargetMonitor,
} from "react-dnd";
import { render } from 'react-dom';
import { CompetencyStore } from '../../stores/CompetencyStore';

const squareTarget: DropTargetSpec<EvaluationItemProps> = {
    canDrop(props, monitor) {
        return props.evaluation.Competencies.length < props.evaluation.Limit;
    },
    drop(props, monitor) {
        let competencyID = (monitor.getItem() as DragData).competencyID;
        props.competencyStore!.evaluateCompetency(competencyID, props.evaluation);
    }
};

const collect: DropTargetCollector = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

interface EvaluationItemProps {
    evaluation: Evaluation,
    competencyStore?: CompetencyStore,
    connectDropTarget?: ConnectDropTarget,
    isOver?: boolean,
    canDrop?: boolean,
}

@inject("competencyStore")
@DropTarget("Competency", squareTarget, collect)
@observer
export class EvaluationItem extends React.Component<EvaluationItemProps, {}> {

    renderOverlay(color: string) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.3,
                backgroundColor: color,
                borderTopLeftRadius: '25px',
            }} />
        );
    }

    removeCompetencyFromEvaluation(competency: Competency) {
        this.props.evaluation.removeCompetency(competency);
    }

    render() {
        const store = this.props.competencyStore;
        return this.props.connectDropTarget(
            <div className='col mx-3 text-dark bg-white' style={{ borderTopLeftRadius: '25px' }}>
                <div className='row'>
                    <div className='col align-self-center' style={{ color: this.props.evaluation.Color }}>
                        <FontAwesomeIcon icon={this.props.evaluation.Icon} className='mx-2' />
                        <span className='font-weight-bold text-uppercase'>{this.props.evaluation.Name}</span>
                    </div>
                    <div className='mr-5 align-self-center'>
                        <span className='font-weight-bold color-dark'>{this.props.evaluation.evaluatedCompetences}/{this.props.evaluation.Limit}</span>
                    </div>
                    <button type="button" className='btn dropdown-toggle-split rounded-0 background-dark' style={{ width: '75px', height: '60px' }} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' disabled={this.props.evaluation.evaluatedCompetences == 0}>
                        <FontAwesomeIcon icon='sort-down' style={{ fontSize: '150%' }} className='align-self-center text-white' />
                    </button>
                    <div className='col dropdown-menu dropdown-menu-right container m-0 p-0 pb-1 rounded-0 border-0 background-dark'>
                        {
                            this.props.evaluation.Competencies.map(competency => {
                                return <div className='mt-1' >
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
                </div>
                {this.props.isOver && !this.props.canDrop && this.renderOverlay('red')}
                {!this.props.isOver && this.props.canDrop && this.renderOverlay('yellow')}
                {this.props.isOver && this.props.canDrop && this.renderOverlay('green')}
            </div>
        );
    }
}