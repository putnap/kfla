import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import NavMenu from '../../components/NavMenu';
import { Loader } from '../../components/Loader';

import { LanguageParam } from '../../@types/types';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { useStore } from '../../stores/hook';
import { VideoModal } from '../../components/VideoModal';
import { FloatingButtonProps, FloatingActionButtons } from '../../components/FloatingButtons';
import { CompetencyItem } from './CompetencyItem';
import { EvaluationItem } from './EvaluationItem';

const CompetencyList = observer(() => {
    const competencyStore = useStore(stores => stores.competencyStore);

    return <div className='row animate-bottom'>
        {
            competencyStore.uneavluatedCompetencies.map(competency => {
                return <CompetencyItem competency={competency} key={competency.ID} />
            })
        }
    </div>
})

const EvaluationList = ({ evaluations }) => {
    return <div className='row pb-2 sticky-top background-light' style={{ top: '60px' }}>
        {
            evaluations.map((evaluation, i) => {
                return <EvaluationItem evaluation={evaluation} key={i} />
            })
        }
    </div>
}

interface CompetenciesContainerProps extends RouteComponentProps<LanguageParam> {
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore;
}

@inject("competencyStore", "localizationStore")
@observer
export class CompetenciesContainer extends React.Component<CompetenciesContainerProps, {}> {
    constructor(props: CompetenciesContainerProps) {
        super(props);

        this.resetEvaluation = this.resetEvaluation.bind(this);
        this.submitEvaluation = this.submitEvaluation.bind(this);
        this.randomEvaluation = this.randomEvaluation.bind(this);
    }

    //async componentDidMount() {
    //    this.props.localizationStore.setTitle('PageTitles.COMPETENCIES');
    //    const { competencyStore } = this.props;
    //    if (!competencyStore.isLoaded) {
    //        await competencyStore.fetchCompetencies();
    //        await competencyStore.fetchEvaluations();
    //    }
    //}

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
                competency.evaluateCompetency(evaluation);
            }
        });
        this.submitEvaluation();
    }

    showInfo() {
        jQuery('#competenciesVideo').modal();
    }

    public render() {
        const { competencyStore, localizationStore }= this.props;

        const floatingButtons: FloatingButtonProps[] = [
            { label: localizationStore.getString('Buttons.Info'), icon: "info", onClick: () => jQuery('#competenciesVideo').modal() },
            { label: localizationStore.getString('Buttons.Submit'), icon: "check", onClick: this.submitEvaluation, disabled: !competencyStore.evaluationReady },
            //{ label: localizationStore.getString('Buttons.Submit'), icon: "random", onClick: this.randomEvaluation },
            { label: localizationStore.getString('Buttons.Reset'), icon: "redo", onClick: this.resetEvaluation },
        ]

        return <DndProvider backend={HTML5Backend}>
            <div className='row background-light height-100'>
                <NavMenu {...this.props} />
                <div className='contentContainer w-100 mx-2 mx-md-5'>
                    <EvaluationList evaluations={competencyStore.evaluations} />
                    {
                        competencyStore.isLoading ?
                            <Loader text={localizationStore.getString('Evaluation.Loading')} /> :
                            <CompetencyList />
                    }
                    <FloatingActionButtons floatingButtons={floatingButtons} />
                    <VideoModal id='competenciesVideo' videoId='2yT0gqnKb-A' />
                </div>
            </div>
        </DndProvider>;
    }
}