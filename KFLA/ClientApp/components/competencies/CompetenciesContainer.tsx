import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, inject } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import { CompetencyList } from './CompetencyList';
import { EvaluationList } from './EvaluationList';
import { NavMenu } from '../NavMenu';
import { Loader } from '../Loader';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { VideoModal } from '../VideoModal';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { LanguageParam } from '@Types/types';

interface CompetenciesContainerProps extends RouteComponentProps<LanguageParam> {
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore;
}

@inject("competencyStore", "localizationStore")
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
        const { language } = this.props.match.params;
        this.props.history.push(`/${language}/evaluation`);
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
        return <DndProvider backend={HTML5Backend}>
            <div className='row background-light height-100'>
                <NavMenu {...this.props} />
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
                        {/*
                    <button onClick={(e) => this.randomEvaluation()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Submit')}>
                        <FontAwesomeIcon icon='check' />
                    </button>
                    */}
                        <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Reset')}>
                            <FontAwesomeIcon icon='redo' />
                        </button>
                    </div>
                    <VideoModal id='competenciesVideo' videoId='2yT0gqnKb-A' />
                </div>
            </div>
        </DndProvider>;
    }
}