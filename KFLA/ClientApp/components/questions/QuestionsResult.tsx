﻿import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { EmptyListWarning } from '../EmptyListWarning';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { Question } from '../../models/Question';
import { PortraitOrientation } from '../orientations';

interface QuestionsResultProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class QuestionsResult extends React.Component<QuestionsResultProps, {}> {

    componentDidUpdate() {
        if (!this.props.competencyStore.questionaireReady) {
            this.props.competencyStore.resetQuestionaire();
            setTimeout(() => {
                this.props.history.push("/questions");
            }, 1500)
        }
    }

    resetQuestionaire() {
        this.props.competencyStore.resetQuestionaire();
        this.props.history.push("/questions");
    }

    printPage() {
        window.print();
    }

    getQuestionsClass(question: Question): string {
        let classes = 'row mb-2';
        if (!question.IsSelected)
            classes += ' react-no-print';
        return classes;
    }

    public render() {
        const store = this.props.competencyStore;

        return <section>
            <div className='row background-dark react-no-print'>
                <NavMenu />
            </div>
            <div className='row background-dark contentContainer height-100 px-5'>
                <PortraitOrientation />
                <div className='col animate-bottom'>
                    <h4 className='pb-3 color-dark react-print'>Behavior-based questions for interviewer</h4>
                    {
                        store.questionaireReady ?
                            store.selectedCompetencies.map(competency => {
                                return <div className='card radius-0 mb-2'>
                                    <div className='card-body'>
                                        <h4 className='card-title pb-1 border-bottom border-dark'>
                                            <span>{competency.ID}.</span>
                                            <span className='pl-3 color-dark'>{competency.Name}</span>
                                        </h4>
                                        <div className='mr-3'>
                                            <p className='card-text font-weight-bold'>{competency.Description}</p>
                                            <p className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' className='color-dark' /><span className='pl-2'>QUESTIONS</span></p>
                                            {
                                                competency.Questions.map((question, i) => {
                                                    return <div className={this.getQuestionsClass(question)} >
                                                        <div className='col'>
                                                            <span className='card-text' style={{ fontSize: '80%' }}>{i + 1}. {question.QuestionContent}</span>
                                                        </div>
                                                        <div className='col-1 align-self-center react-no-print'>
                                                            <label className='check-container'>
                                                                <input type='checkbox' checked={question.IsSelected} onClick={(e) => question.toggleSelection()} />
                                                                <span className='checkmark'></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className='react-print'>
                                            <p className='card-text font-weight-bold'>Notes:</p>
                                            <hr className='dotted' />
                                            <hr className='dotted' />
                                        </div>
                                    </div>
                                </div>
                            }) :
                            <Loader text='No competencies selected. Redirrecting...' />
                    }
                </div>
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.printPage()} disabled={!store.questionaireReady} className='btn rounded-circle' title='Print'>
                        <FontAwesomeIcon icon='print' />
                    </button>
                    <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle' title='Reset'>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
            </div>
        </section>;

    }
}