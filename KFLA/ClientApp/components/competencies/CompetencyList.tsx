import * as React from 'react';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { DragDropContext, Backend } from "react-dnd";
import {
    DropTarget, DropTargetSpec, DropTargetCollector, ConnectDropTarget,DropTargetConnector, DropTargetMonitor,
    DragSource, DragSourceConnector, DragSourceMonitor, ConnectDragSource, DragSourceSpec, DragSourceCollector
} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

interface CompetencyListProps {
    competencies: Competency[]
}

interface CompetencyListPropsState {
    evaluations: Evaluation[]
}

@DragDropContext(HTML5Backend)
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
                            return <EvaluationItem evaluation={evaluation} />
                        })
                    }
                </div>
                <div className='row'>
                    {
                        this.props.competencies.map(competency => {
                            return <CompetencyItem competency={competency} />
                        })
                    }
                </div>
            </section>
        )
    }

}

interface CompetencyItemProps {
    competency: Competency,
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
}

const dragSource: DragSourceSpec<CompetencyItemProps> = {
    beginDrag(props) {
        return {};
    }
};

const dragCollect: DragSourceCollector = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
};

@DragSource("Competency", dragSource, dragCollect)
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {
    render() {
        return this.props.connectDragSource(
            <div className='col-4' key={this.props.competency.ID} style={{ opacity: this.props.isDragging ? 0.5 : 1 }}>
                <div className='border border-dark m-2'>
                    <div className='p-3'>
                        <span>{this.props.competency.ID}</span>
                        <span className='pl-3'>{this.props.competency.Name}</span>
                    </div>
                    <div className='p-3'>
                        <span>{this.props.competency.Description}</span>
                    </div>
                </div>
            </div >
        );
    }
}

const squareTarget: DropTargetSpec<EvaluationItemProps> = {
    canDrop(props) {
        return props.evaluation.Competencies.length < props.evaluation.Limit;
    },
    drop(props) {
        if (props.dragCompetency != null)
            props.evaluation.Competencies.push(props.dragCompetency);
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
    connectDropTarget?: ConnectDropTarget,
    isOver?: boolean,
    canDrop?: boolean,
    dragCompetency?: Competency,
}

@DropTarget("Competency", squareTarget, collect)
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
        return this.props.connectDropTarget(
            <div className='col' key={this.props.evaluation.Name} >
                <div className='border border-dark p-3 m-2 bg-light text-dark'>
                    <span className='p-3'>{this.props.evaluation.Name}</span>
                    <span className='badge badge-dark'>{this.props.evaluation.Competencies.length}/{this.props.evaluation.Limit}</span>
                </div>
                {this.props.isOver && !this.props.canDrop && this.renderOverlay('red')}
                {!this.props.isOver && this.props.canDrop && this.renderOverlay('yellow')}
                {this.props.isOver && this.props.canDrop && this.renderOverlay('green')}
            </div>
        );
    }
}

