﻿import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { Question } from '../../models/Question';
import { PortraitOrientation } from '../orientations';
import { StoppersStore } from '../../stores/StoppersStore';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface QuestionsResultProps extends RouteComponentProps<{}> {
    stoppersStore?: StoppersStore
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore
}

@inject("stoppersStore", "competencyStore", "localizationStore")
@observer
export class QuestionsResult extends React.Component<QuestionsResultProps, {}> {

    componentDidUpdate() {
        if (!this.props.competencyStore.questionaireReady && !this.props.stoppersStore.questionaireReady) {
            this.props.competencyStore.resetQuestionaire();
            this.props.stoppersStore.resetQuestionaire();
            setTimeout(() => {
                this.props.history.push("/questions");
            }, 1500)
        }
    }

    resetQuestionaire() {
        this.props.competencyStore.resetQuestionaire();
        this.props.stoppersStore.resetQuestionaire();
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
        const stoppersStore = this.props.stoppersStore!;
        const competencyStore = this.props.competencyStore!;
        const questionaireReady = stoppersStore.questionaireReady || competencyStore.questionaireReady;

        return <section>
            <div className='row background-dark react-no-print'>
                <NavMenu />
            </div>
            <div className='row background-dark contentContainer height-100 px-5'>
                <PortraitOrientation />
                <div className='col animate-bottom'>
                    {
                        questionaireReady ?
                            [
                                competencyStore.selectedCompetencies.map(competency => {
                                    return <div className='card radius-0 mb-2'>
                                        <div className='card-body'>
                                            <h4 className='card-title pb-1 border-bottom border-dark'>
                                                <span>{competency.ID}.</span>
                                                <span className='pl-3 color-dark'>{competency.Name}</span>
                                            </h4>
                                            <div className='mr-3'>
                                                <p className='card-text font-weight-bold'>{competency.Description}</p>
                                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' className='color-dark' /><span className='pl-2'>{this.props.localizationStore.getString('QuestionsResult.Questions')}</span></p>
                                                {
                                                    competency.Questions.map((question, i) => {
                                                        return <div className={this.getQuestionsClass(question)} >
                                                            <div className='col-1 align-self-center react-no-print'>
                                                                <label className='check-container'>
                                                                    <input type='checkbox' checked={question.IsSelected} onClick={(e) => question.toggleSelection()} />
                                                                    <span className='checkmark'></span>
                                                                </label>
                                                            </div>
                                                            <div className='col'>
                                                                <span className='card-text' style={{ fontSize: '80%' }}>{i + 1}. {question.QuestionContent}</span>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                            <div className='react-print'>
                                                <p className='card-text font-weight-bold'>{this.props.localizationStore.getString('QuestionsResult.Notes')}:</p>
                                                <hr className='dotted' />
                                                <hr className='dotted' />
                                            </div>
                                        </div>
                                    </div>
                                }),
                                stoppersStore.selectedStoppers.map(stopper => {
                                    return <div className='card radius-0 mb-2'>
                                        <div className='card-body'>
                                            <h4 className='card-title pb-1 border-bottom border-dark'>
                                                <span>{stopper.ID}.</span>
                                                <span className='pl-3 color-dark'>{stopper.Name}</span>
                                            </h4>
                                            <div className='mr-3'>
                                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' className='color-dark' /><span className='pl-2'>{this.props.localizationStore.getString('QuestionsResult.Questions')}</span></p>
                                                {
                                                    stopper.Questions.map((question, i) => {
                                                        return <div className={this.getQuestionsClass(question)} >
                                                            <div className='col-1 align-self-center react-no-print'>
                                                                <label className='check-container'>
                                                                    <input type='checkbox' checked={question.IsSelected} onClick={(e) => question.toggleSelection()} />
                                                                    <span className='checkmark'></span>
                                                                </label>
                                                            </div>
                                                            <div className='col'>
                                                                <span className='card-text' style={{ fontSize: '80%' }}>{i + 1}. {question.QuestionContent}</span>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                            <div className='react-print'>
                                                <p className='card-text font-weight-bold'>{this.props.localizationStore.getString('QuestionsResult.Notes')}:</p>
                                                <hr className='dotted' />
                                                <hr className='dotted' />
                                            </div>
                                        </div>
                                    </div>
                                })
                            ] :
                            <Loader text={this.props.localizationStore.getString('QuestionsResult.Empty')} />
                    }
                </div>
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.printPage()} disabled={!questionaireReady} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Print')}>
                        <FontAwesomeIcon icon='print' />
                    </button>
                    <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Reset')}>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
            </div>
        </section>;

    }
}