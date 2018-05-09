import * as React from 'react';
import { observer, inject } from 'mobx-react';
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
                opacity: 0.5,
                backgroundColor: color,
            }} />
        );
    }

    render() {
        const store = this.props.competencyStore;
        return this.props.connectDropTarget(
            <div className='col'>
                <div className='border border-dark p-3 m-2 bg-light text-dark'>
                    <span className='p-3'>{this.props.evaluation.Name}</span>
                    <span className='badge badge-dark'>{this.props.evaluation.evaluatedCompetences}/{this.props.evaluation.Limit}</span>
                    {this.props.isOver && !this.props.canDrop && this.renderOverlay('red')}
                    {!this.props.isOver && this.props.canDrop && this.renderOverlay('yellow')}
                    {this.props.isOver && this.props.canDrop && this.renderOverlay('green')}
                </div>
            </div>
        );
    }
}