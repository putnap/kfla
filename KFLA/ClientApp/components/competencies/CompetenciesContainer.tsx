import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, inject } from 'mobx-react';
import HTML5Backend from "react-dnd-html5-backend";
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { CompetencyList } from './CompetencyList';
import { EvaluationList } from './EvaluationList';
import { NavMenu } from '../NavMenu';
import { Loader } from '../Loader';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { PageTitles } from '../../@types/types';
import withDragDropContext from '../withDragDropContext';

interface CompetenciesContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@withDragDropContext
@observer
export class CompetenciesContainer extends React.Component<CompetenciesContainerProps, {}> {

    componentDidMount() {
        document.title = PageTitles.COMPETENCIES;
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
        this.props.history.push("/evaluation");
    }

    public render() {
        const store = this.props.competencyStore;
        return <div className='row background-light height-100'>
            <NavMenu />
            <div className='contentContainer w-100 mx-5'>
                <EvaluationList evaluations={store!.evaluations} />
                {
                    store!.isLoading ? <Loader text='Loading competencies...' /> : <CompetencyList competencyStore={store!} />
                }
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.submitEvaluation()} disabled={!store.evaluationReady} className='btn rounded-circle' title='Submit'>
                        <FontAwesomeIcon icon='check' />
                    </button>
                    <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle' title='Reset'>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
            </div>
        </div>;
    }
}