import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { EmptyListWarning } from '../EmptyListWarning';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { Factor } from '../../models/Factor';

interface QuestionsContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class QuestionsContainer extends React.Component<QuestionsContainerProps, {}> {

    componentDidMount() {
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
    }

    resetQuestionaire() {
        this.props.competencyStore.resetQuestionaire();
    }

    submitQuestionaire() {
        this.props.history.push("/questionaire");
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <div className='row'>
            <div className='col-1 p-0 text-right'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <div className='font-weight-bold'>{competency.Name}</div>
                <div>{competency.Description}</div>
            </div>
            <div className='col-1 p-0 align-self-center'>
                <label className='check-container'>
                    <input type='checkbox' checked={competency.IsSelected} onClick={(e) => competency.toggleSelection()} />
                    <span className='checkmark'></span>
                </label>
            </div>
        </div>;
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='row background-light'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100 px-5'>
                <div className='col'>
                    {
                        store!.isLoading ? <Loader text='Loading competencies...' /> : <FactorList factors={store.factors} renderCompetency={this.renderCompetency} animate={true} />
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <button onClick={(e) => this.submitQuestionaire()} disabled={!store.questionaireReady} className='btn rounded-circle background-dark' title='Submit'>
                    <i className='fas fa-check'></i>
                </button>
                <button onClick={(e) => this.resetQuestionaire()} className='btn rounded-circle background-dark' title='Reset'>
                    <i className='fas fa-redo'></i>
                </button>
            </div>
        </section>;
        
    }
}