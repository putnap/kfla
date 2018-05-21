import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { EmptyListWarning } from '../EmptyListWarning';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { QuestionsPrintTemplate } from './QuestionsPrintTemplate';

interface QuestionsResultProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class QuestionsResult extends React.Component<QuestionsResultProps, {}> {

    constructor(props: QuestionsResultProps) {
        super(props);

        window.matchMedia('print').addListener(() => {
            if (window.matchMedia('print').matches) {
                ReactDOM.render(<QuestionsPrintTemplate competencies={this.props.competencyStore.selectedCompetencies} />, document.getElementById('react-print'));
            }
            else {
                var element = document.getElementById('react-print');
                if (element != null)
                    ReactDOM.unmountComponentAtNode(element);
            }
        });
    }

    resetQuestionaire() {
        this.props.competencyStore.resetQuestionaire();
        this.props.history.push("/questions");
    }

    printPage() {
        window.print();
    }

    componentDidUpdate() {
        if (!this.props.competencyStore.questionaireReady) {
            this.props.competencyStore.resetQuestionaire();
            setTimeout(() => {
                this.props.history.push("/questions");
            }, 2000)
        }
    }

    public render() {
        const store = this.props.competencyStore;

        return <section>
            <div className='row background-light'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100 px-5'>
                <div className='col animate-bottom'>
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
                                            <p className='card-text font-weight-bold'><i className='far fa-question-circle color-dark'></i><span className='pl-2'>QUESTIONS</span></p>
                                            {
                                                competency.Questions.map((question, i) => {
                                                    return <div className='row mb-2'>
                                                        <div className='col-1 align-self-center'>
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
                                    </div>
                                </div>
                            }) :
                            <Loader text='No competencies selected. Redirrecting...' />
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <button onClick={(e) => this.printPage()} className='btn rounded-circle background-dark' title='Print'>
                    <i className='fas fa-print'></i>
                </button>
                <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle background-dark' title='Reset'>
                    <i className='fas fa-redo'></i>
                </button>
            </div>
        </section>;

    }
}