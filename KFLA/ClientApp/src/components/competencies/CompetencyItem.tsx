import * as React from 'react';
import { useDrag } from "react-dnd";
import { Competency } from '../../models/Competency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { printList } from '../skillPrinter';
import { Evaluation } from '../../models/Evaluation';
import { useStore } from '../../stores/hook';

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

const computeCardClass = (flipped) => {
    let classes = 'card radius-0 flip';
    if (flipped)
        classes += ' flipped';
    return classes;
}


export const CompetencyItem: React.FC<{ competency: Competency }> = props => {
    const { competency } = props;

    const cardFrontRef = React.createRef<HTMLDivElement>();
    const cardBackRef = React.createRef<HTMLDivElement>();

    const [flipped, flip] = React.useState(false);
    const [cardHeight, setHeight] = React.useState(null);

    React.useEffect(() => {
        if (cardFrontRef.current.clientHeight > cardBackRef.current.clientHeight)
            setHeight(cardFrontRef.current.clientHeight);
        else
            setHeight(cardBackRef.current.clientHeight);
    }, [cardHeight, setHeight, cardBackRef, cardFrontRef]);

    const cardClasses = computeCardClass(flipped);

    return <DragableCompetency competency={competency}>
        <div className={cardClasses} >
            <Front competency={competency} cardHeight={cardHeight} frontRef={cardFrontRef} flip={() => flip(true)} />
            <Back competency={competency} cardHeight={cardHeight} backRef={cardBackRef} flip={() => flip(false)} />
        </div>
    </DragableCompetency>
}

const Front: React.FC<{ competency, cardHeight, frontRef, flip }> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { competency, cardHeight, frontRef, flip } = props;

    return <div className='face front'>
        <div className='card-body' style={{ minHeight: cardHeight }} ref={frontRef}>
            <h4 className='card-title pb-1 border-bottom border-dark'>
                <span>{competency.ID}.</span>
                <span className='pl-3 color-dark'>{competency.Name}</span>
            </h4>
            <div className='mr-3'>
                <p className='card-text font-weight-bold'>{competency.Description}</p>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' className='color-dark' /><span className='pl-2'>{localizationStore.getString('Skills.SKILLED')}</span></p>
                {printList(competency.Skilled)}
            </div>
        </div>
        <div className='card-footer' style={{ fontSize: '9px' }}>
            {localizationStore.getString('CompetencyItem.Cards')}
        </div>
        <button type='button' className='btn position-absolute btn-flip' style={{ background: 'none', top: '50%', right: '5px' }} onClick={() => flip()}><FontAwesomeIcon icon='angle-right' /></button>
    </div>
}

const Back: React.FC<{ competency, cardHeight, backRef, flip }> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { competency, cardHeight, backRef, flip } = props;

    return <div className='face back'>
        <div ref={backRef} className='card-body' style={{ minHeight: cardHeight }}>
            <h4 className='card-title pb-1 border-bottom border-white'>
                <span>{competency.ID}.</span>
                <span className='pl-3'>{competency.Name}</span>
            </h4>
            <div className='row mr-3'>
                <div className='col'>
                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{localizationStore.getString('Skills.OVERUSED')}</span></p>
                    {printList(competency.OverusedSkill)}
                </div>
                <div className='col'>
                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.LESS')}</span></p>
                    {printList(competency.LessSkilled)}
                </div>
            </div>
        </div>
        <div className='card-footer' style={{ fontSize: '9px' }}>
            {localizationStore.getString('CompetencyItem.Cards')}
        </div>
        <button type='button' className='btn position-absolute btn-flip' style={{ background: 'none', top: '50%', right: '5px' }} onClick={() => flip()}><FontAwesomeIcon icon='angle-left' /></button>
    </div>
}

