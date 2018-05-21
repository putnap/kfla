import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    competency: Competency;
    competencyStore?: CompetencyStore;
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
}

interface CompetencyItemState {
    flipped: boolean;
    cardHeight?: number;
}

@inject("competencyStore")
@DragSource("Competency", dragSource, dragCollect)
@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, CompetencyItemState> {

    private cardFront: HTMLDivElement;
    private cardBack: HTMLDivElement;

    constructor(props: CompetencyItemProps) {
        super(props);

        this.state = {
            flipped: false,
            cardHeight: null
        };
    }

    flip() {
        const currentState = this.state.flipped;
        const currentHeight = this.state.cardHeight;
        this.setState({ flipped: !currentState, cardHeight: currentHeight });
    }

    computeCardClass() {
        let classes = 'card radius-0 flip';
        if (this.state.flipped)
            classes += ' flipped';
        return classes;
    }

    splitStringToList(text: string) {
        return <ul>
            {text.split("\n").map(i => {
                if (i)
                    return <li>{i}</li>;
            })}
        </ul>
    }

    componentDidMount() {
        if (this.cardFront.clientHeight > this.cardBack.clientHeight)
            this.setState({ flipped: this.state.flipped, cardHeight: this.cardFront.clientHeight });
        else
            this.setState({ flipped: this.state.flipped, cardHeight: this.cardBack.clientHeight });
    }

    render() {
        const cardClasses = this.computeCardClass();
        return this.props.connectDragSource(
            <div className='col-4 mb-2' style={{ opacity: this.props.isDragging ? 0.5 : 1 }}>
                <div className={cardClasses}>
                    <div className='face front'>
                        <div ref={ref => this.cardFront = ref} className='card-body' style={{ minHeight: this.state.cardHeight }}>
                            <h4 className='card-title pb-1 border-bottom border-dark'>
                                <span>{this.props.competency.ID}.</span>
                                <span className='pl-3 color-dark'>{this.props.competency.Name}</span>
                            </h4>
                            <div className='mr-3'>
                                <p className='card-text font-weight-bold'>{this.props.competency.Description}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' className='color-dark' /><span className='pl-2'>SKILLED</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.Skilled)}</p>
                            </div>
                        </div>
                        <div className='card-footer'>
                            Lorem Ipsum dolor sit amet consecteteur odio non tellus natoque accumsan.
                        </div>
                        <button type='button' className='btn position-absolute' style={{ background: 'none', top: '50%', right: '5px' }} onClick={(e) => this.flip()}><FontAwesomeIcon icon='angle-right' className='color-dark' style={{ fontSize: '200%' }} /></button>
                    </div>
                    <div className='face back background-dark'>
                        <div ref={ref => this.cardBack = ref} className='card-body' style={{ minHeight: this.state.cardHeight }}>
                            <h4 className='card-title pb-1 border-bottom border-white'>
                                <span>{this.props.competency.ID}.</span>
                                <span className='pl-3'>{this.props.competency.Name}</span>
                            </h4>
                            <div className='row mr-3'>
                                <div className='col'>
                                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>OVERUSED SKILL</span></p>
                                    <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.OverusedSkill)}</p>
                                </div>
                                <div className='col'>
                                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>LESS SKILL</span></p>
                                    <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.LessSkilled)}</p>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer'>
                            Lorem Ipsum dolor sit amet consecteteur odio non tellus natoque accumsan.
                        </div>
                        <button type='button' className='btn position-absolute' style={{ background: 'none', top: '50%', right: '5px' }} onClick={(e) => this.flip()}><FontAwesomeIcon icon='angle-left' className='color-dark' style={{ fontSize: '200%', color: '#FFFFFF' }} /></button>
                    </div>
                </div>
            </div>
        );
    }
}


