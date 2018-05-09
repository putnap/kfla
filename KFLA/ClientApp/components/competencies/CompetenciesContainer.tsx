import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { DragDropContext, Backend } from "react-dnd";
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
            <div className='row'>
                <NavMenu />
            </div>
            <div className='row contentContainer'>
                <div className='col'>
                    <EvaluationList evaluations={store!.evaluations} />
                    {
                        store!.isLoading ? <Loader /> : <CompetencyList competencyStore={store!} />
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <button onClick={(e) => this.submitEvaluation()} disabled={!store.evaluationReady} className='btn btn-secondary rounded-circle'>
                    S
                </button>
                <button onClick={(e) => this.resetEvaluation()} className='btn btn-secondary rounded-circle'>
                    R
                </button>
            </div>
        </section>;
    }
}