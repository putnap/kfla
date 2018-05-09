import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer, inject } from 'mobx-react';
import { Evaluation } from '../../models/Evaluation';
import {
    DragSource, DragSourceConnector, DragSourceMonitor, ConnectDragSource, DragSourceSpec, DragSourceCollector
} from "react-dnd";
import { render } from 'react-dom';
import { CompetencyStore } from '../../stores/CompetencyStore';

const dragSource: DragSourceSpec<CompetencyItemProps> = {
    beginDrag(props) {
        return { competencyID: props.competency.ID };
    },
    endDrag(props, monitor) {
    }
};

const dragCollect: DragSourceCollector = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
};

interface CompetencyItemProps {
    competency: Competency,
    competencyStore?: CompetencyStore,
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
}

@inject("competencyStore")
@DragSource("Competency", dragSource, dragCollect)
@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {
    render() {
        return this.props.connectDragSource(
            <div className='col-4' style={{ opacity: this.props.isDragging ? 0.5 : 1 }}>
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


