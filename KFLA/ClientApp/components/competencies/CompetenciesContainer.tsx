import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { EmptyListWarning } from '../EmptyListWarning';
import { CompetencyList } from './CompetencyList';
import { EvaluationList } from './EvaluationList';
import { NavMenu } from '../NavMenu';
import { Loader } from '../Loader';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Stores } from 'ClientApp/@types/types';
import { Link } from 'react-router-dom';

interface CompetenciesContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@DragDropContext(HTML5Backend)
@observer
export class CompetenciesContainer extends React.Component<CompetenciesContainerProps, {}> {

    componentDidMount() {
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
        //else if (store!.evaluatedCompetencies.length > 0)
        //    this.props.competencyStore.resetEvaluation();
    }

    resetEvaluation() {
        this.props.competencyStore.resetEvaluation();
    }

    submitEvaluation() {
        this.props.competencyStore.submitEvaluation(this.navigateToResults.bind(this));
    }

    navigateToResults() {
        this.props.history.push("/evaluation");
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='row background-light'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100'>
                <div className='col'>
                    <EvaluationList evaluations={store!.evaluations} />
                    {
                        store!.isLoading ? <Loader /> : <CompetencyList competencyStore={store!} />
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <button onClick={(e) => this.submitEvaluation()} disabled={!store.evaluationReady} className='btn rounded-circle background-dark' title='Submit'>
                    <i className='fas fa-check'></i>
                </button>
                <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle background-dark' title='Reset'>
                    <i className='fas fa-redo'></i>
                </button>
            </div>
        </section>;
    }
}