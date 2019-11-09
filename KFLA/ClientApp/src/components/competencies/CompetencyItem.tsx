import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrag } from "react-dnd";
import { CompetencyStore } from '../../stores/CompetencyStore';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { printList } from '../skillPrinter';
import { Evaluation } from '../../models/Evaluation';

interface CompetencyItemProps {
    competency: Competency;
    competencyStore?: CompetencyStore;
    localizationStore?: LocalizationStore;
}

interface CompetencyItemState {
    flipped: boolean;
    cardHeight?: number;
}

const DragableCompetency: React.FC<{ competency: Competency }> = props => {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'Competency' },
        end: (item, monitor) => {
            const evaluation: Evaluation = monitor.getDropResult()
            if (item && evaluation) {
                props.competency.evaluateCompetency(evaluation);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0.5 : 1

    return (
        <div
            ref={drag}
            className='col-4 mb-2'
            style={{ opacity }}>
            {props.children}
        </div>)
}

@inject("competencyStore", "localizationStore")
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

    componentDidMount() {
        if (this.cardFront.clientHeight > this.cardBack.clientHeight)
            this.setState({ flipped: this.state.flipped, cardHeight: this.cardFront.clientHeight });
        else
            this.setState({ flipped: this.state.flipped, cardHeight: this.cardBack.clientHeight });
    }

    render() {
        const cardClasses = this.computeCardClass();
        return <DragableCompetency competency={this.props.competency}>
            <div className={cardClasses} >
                <div className='face front'>
                    <div ref={ref => this.cardFront = ref} className='card-body' style={{ minHeight: this.state.cardHeight }}>
                        <h4 className='card-title pb-1 border-bottom border-dark'>
                            <span>{this.props.competency.ID}.</span>
                            <span className='pl-3 color-dark'>{this.props.competency.Name}</span>
                        </h4>
                        <div className='mr-3'>
                            <p className='card-text font-weight-bold'>{this.props.competency.Description}</p>
                            <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' className='color-dark' /><span className='pl-2'>{this.props.localizationStore.getString('Skills.SKILLED')}</span></p>
                            {printList(this.props.competency.Skilled)}
                        </div>
                    </div>
                    <div className='card-footer' style={{ fontSize: '9px' }}>
                        {this.props.localizationStore.getString('CompetencyItem.Cards')}
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
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{this.props.localizationStore.getString('Skills.OVERUSED')}</span></p>
                                {printList(this.props.competency.OverusedSkill)}
                            </div>
                            <div className='col'>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{this.props.localizationStore.getString('Skills.LESS')}</span></p>
                                {printList(this.props.competency.LessSkilled)}
                            </div>
                        </div>
                    </div>
                    <div className='card-footer' style={{ fontSize: '9px' }}>
                        {this.props.localizationStore.getString('CompetencyItem.Cards')}
                    </div>
                    <button type='button' className='btn position-absolute' style={{ background: 'none', top: '50%', right: '5px' }} onClick={(e) => this.flip()}><FontAwesomeIcon icon='angle-left' className='color-dark' style={{ fontSize: '200%', color: '#FFFFFF' }} /></button>
                </div>
            </div>
        </DragableCompetency>
    }
}


