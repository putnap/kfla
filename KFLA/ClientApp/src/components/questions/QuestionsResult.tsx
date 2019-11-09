import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react-lite';
import NavMenu from '../NavMenu';
import { Loader } from '../Loader';
import { PortraitOrientation } from '../orientations';
import { LanguageParam } from '../../@types/types';
import { CompetencyWithQuestions } from './CompetencyWithQuestions';
import { StopperWithQuestions } from './StopperWithQuestions';
import { FloatingButtonProps, FloatingActionButtons } from '../FloatingButtons';
import { useStore } from '../../stores/hook';

export const QuestionsResult: React.FC<RouteComponentProps<LanguageParam>> = observer(props => {

    const { language } = props.match.params;
    const { history } = props;
    const { localizationStore, competencyStore, stoppersStore } = useStore(stores => stores);
    const questionaireReady = stoppersStore.questionaireReady || competencyStore.questionaireReady;

    const resetQuestionaire = () => {
        competencyStore.resetQuestionaire();
        stoppersStore.resetQuestionaire();
        navigateToQuestions();
    }

    const navigateToQuestions = React.useCallback(() => {
        history.push(`/${language}/questions`);
    }, [language, history]);

    React.useEffect(() => {
        if (!questionaireReady) {
            competencyStore.resetQuestionaire();
            stoppersStore.resetQuestionaire();
            setTimeout(() => {
                navigateToQuestions();
            }, 1500)
        }
    }, [questionaireReady, competencyStore, stoppersStore, navigateToQuestions]);


    const floatingButtons: FloatingButtonProps[] = [
        { label: localizationStore.getString('Buttons.Print'), icon: "print", disabled: !questionaireReady, onClick: () => window.print() },
        { label: localizationStore.getString('Buttons.Reset'), icon: "redo", onClick: () => resetQuestionaire() },
    ]

    return <section>
        <div className='row background-dark react-no-print'>
            <NavMenu {...props} />
        </div>
        <div className='row background-dark contentContainer height-100 px-1 px-md-5'>
            <PortraitOrientation />
            <div className='col animate-bottom'>
                {
                    questionaireReady ?
                        [
                            competencyStore.selectedCompetencies.map((competency, i) => {
                                return <CompetencyWithQuestions competency={competency} key={i} />
                            }),
                            stoppersStore.selectedStoppers.map((stopper, i) => {
                                return <StopperWithQuestions stopper={stopper} key={i} />
                            })
                        ] :
                        <Loader text={localizationStore.getString('QuestionsResult.Empty')} />
                }
            </div>
            <FloatingActionButtons floatingButtons={floatingButtons} />
        </div>
    </section>
})