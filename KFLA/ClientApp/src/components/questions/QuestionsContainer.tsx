import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react-lite';
import { Competency } from '../../models/Competency';
import NavMenu from '../NavMenu';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { VideoModal } from '../VideoModal';
import { StoppersList } from '../StoppersList';
import { Stopper } from '../../models/Stopper';
import { SelectableStopperItem } from './SelectableStopperItem';
import { SelectableCompetencyItem } from './SelectableCompetencyItem';
import { LanguageParam } from '../../@types/types';
import { FloatingActionButtons, FloatingButtonProps } from '../FloatingButtons';
import { useStore } from '../../stores/hook';

const StopperItemFunction = (stopper: Stopper) => {
    return <SelectableStopperItem stopper={stopper} key={stopper.ID} />;
}

const CompetencyItemFunction = (competency: Competency) => {
    return <SelectableCompetencyItem competency={competency} key={competency.ID} />;
}

export const QuestionsContainer: React.FC<RouteComponentProps<LanguageParam>> = observer(props => {

    const { localizationStore, competencyStore, stoppersStore } = useStore(stores => stores);

    React.useEffect(() => localizationStore.setTitle('PageTitles.QUESTIONS'));

    const resetQuestionaire = () => {
        if (window.confirm(localizationStore.getString('Questionaire.Reset')))
            competencyStore.resetQuestionaire();
    }

    const submitQuestionaire = () => {
        const { language } = props.match.params;
        props.history.push(`/${language}/questionaire`);
    }

    const floatingButtons: FloatingButtonProps[] = [
        { label: localizationStore.getString('Buttons.Submit'), icon: "check", disabled: !competencyStore.questionaireReady && !stoppersStore.questionaireReady, onClick: () => submitQuestionaire() },
        { label: localizationStore.getString('Buttons.Reset'), icon: "redo", disabled: !competencyStore.questionaireReady && !stoppersStore.questionaireReady, onClick: () => resetQuestionaire() },
        { label: localizationStore.getString('Buttons.Info'), icon: "info", onClick: () => jQuery('#questionsVideo').modal() },
    ]

    return <div className='row background-dark height-100 '>
        <NavMenu />
        <div className='mx-2 mx-md-5 w-100 main-content'>
            {
                competencyStore.isLoading ?
                    <Loader text={localizationStore.getString('Questionaire.Loading')} /> :
                    <FactorList factors={competencyStore.factors} renderCompetency={CompetencyItemFunction} animate={true} />
            }
            <StoppersList animate={true} renderStopper={StopperItemFunction} />
            <FloatingActionButtons floatingButtons={floatingButtons} />
            <VideoModal id='questionsVideo' videoId='F7Dv7Oxo4rc' />
        </div>
    </div>
})