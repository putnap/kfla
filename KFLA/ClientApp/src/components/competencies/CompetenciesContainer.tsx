import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import NavMenu from '../../components/NavMenu';
import { Loader } from '../../components/Loader';
import { LanguageParam } from '../../@types/types';
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

export const CompetenciesContainer: React.FC<RouteComponentProps<LanguageParam>> = observer(props => {

    const { localizationStore, competencyStore } = useStore(stores => stores);

    const resetEvaluation = () => {
        if (window.confirm(localizationStore.getString('Evaluation.Reset')))
            competencyStore.resetEvaluation();
    }

    const submitEvaluation = () => {
        const { language } = props.match.params;
        props.history.push(`/${language}/evaluation`);
    }

    const randomEvaluation = () => {
        competencyStore.evaluations.forEach(evaluation => {
            while (evaluation.Limit > evaluation.evaluatedCompetences) {
                const competency = competencyStore.uneavluatedCompetencies[0];
                competency.evaluateCompetency(evaluation);
            }
        });
        submitEvaluation();
    }

    const floatingButtons: FloatingButtonProps[] = [
        { label: localizationStore.getString('Buttons.Submit'), icon: "check", onClick: submitEvaluation, disabled: !competencyStore.evaluationReady },
        //{ label: localizationStore.getString('Buttons.Submit'), icon: "random", onClick: randomEvaluation },
        { label: localizationStore.getString('Buttons.Reset'), icon: "redo", onClick: resetEvaluation },
        { label: localizationStore.getString('Buttons.Info'), icon: "info", onClick: () => jQuery('#competenciesVideo').modal() },
    ]

    return <DndProvider backend={HTML5Backend}>
        <div className='row background-light height-100'>
            <NavMenu {...props} />
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
})