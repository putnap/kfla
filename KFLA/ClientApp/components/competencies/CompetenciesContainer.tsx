import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, inject } from 'mobx-react';
import { CompetencyList } from './CompetencyList';
import { EvaluationList } from './EvaluationList';
import { NavMenu } from '../NavMenu';
import { Loader } from '../Loader';
import { CompetencyStore } from '../../stores/CompetencyStore';
import withDragDropContext from '../withDragDropContext';
import { VideoModal } from '../VideoModal';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface CompetenciesContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore;
}

@inject("competencyStore", "localizationStore")
@withDragDropContext
@observer
export class CompetenciesContainer extends React.Component<CompetenciesContainerProps, {}> {

    componentDidMount() {
        this.props.localizationStore.setTitle('PageTitles.COMPETENCIES');
        const store = this.props.competencyStore;
        if (!store!.isLoaded) {
            store!.fetchCompetencies();
            store!.fetchEvaluations();
        }
        //else if (store!.evaluatedCompetencies.length > 0)
        //    this.props.competencyStore.resetEvaluation();
    }

    resetEvaluation() {
        if (window.confirm(this.props.localizationStore.getString('Evaluation.Reset')))
            this.props.competencyStore.resetEvaluation();
    }

    submitEvaluation() {
        this.props.history.push("/evaluation");
    }

    randomEvaluation() {
        this.props.competencyStore.evaluations.forEach(evaluation => {
            while (evaluation.Limit > evaluation.evaluatedCompetences) {
                const competency = this.props.competencyStore.uneavluatedCompetencies[0];
                this.props.competencyStore.evaluateCompetency(competency.ID, evaluation);
            }
        });
        this.submitEvaluation();
    }

    showInfo() {
        jQuery('#competenciesVideo').modal();
    }

    public render() {
        const store = this.props.competencyStore;
        return <div className='row background-light height-100'>
            <NavMenu />
            <div className='contentContainer w-100 mx-2 mx-md-5'>
                <EvaluationList evaluations={store!.evaluations} />
                {
                    store!.isLoading ? <Loader text={this.props.localizationStore.getString('Evaluation.Loading')} /> : <CompetencyList competencyStore={store!} />
                }
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Info')}>
                        <FontAwesomeIcon icon='info' />
                    </button>
                    <button onClick={(e) => this.submitEvaluation()} disabled={!store.evaluationReady} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Submit')}>
                        <FontAwesomeIcon icon='check' />
                    </button>
                    <button onClick={(e) => this.randomEvaluation()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Submit')}>
                        <FontAwesomeIcon icon='check' />
                    </button>
                    <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Reset')}>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
                <VideoModal id='competenciesVideo' videoId='2yT0gqnKb-A' />
            </div>
        </div>;
    }
}