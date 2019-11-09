import * as React from 'react';
import * as jQuery from 'jquery';
import { Competency } from '../../models/Competency';
import NavMenu from '../../components/NavMenu';
import { Loader } from '../../components/Loader';
import { FactorList } from '../../components/FactorList';
import CompetencyItem from './CompetencyItem';
import { StoppersList } from '../../components/StoppersList';
import { CompetencyList } from './CompetencyList';
import { VideoModal } from '../../components/VideoModal';
import StopperItem from './StopperItem';
import { Stopper } from '../../models/Stopper';
import { FloatingButtonProps, FloatingActionButtons } from '../../components/FloatingButtons';
import { useStore } from '../../stores/hook';

const StopperItemFunction = (stopper: Stopper) => {
    return <StopperItem stopper={stopper} key={stopper.ID} />
}

const CompetencyItemFunction = (competency: Competency) => {
    return <CompetencyItem competency={competency} key={competency.ID} />
}

export const LibraryContainer: React.FC = props => {

    const localizationStore = useStore(stores => stores.localizationStore);
    const competencyStore = useStore(stores => stores.competencyStore);

    const [numericSort, setSort] = React.useState(false);
    React.useEffect(() => localizationStore.setTitle('PageTitles.LIBRARY'));

    const floatingButtons: FloatingButtonProps[] = [
        { label: localizationStore.getString('Library.SortByNumber'), icon: "sort-numeric-down", onClick: () => setSort(true), hidden: numericSort },
        { label: localizationStore.getString('Library.SortByFactors'), icon: "sort-amount-down", onClick: () => setSort(false), hidden: !numericSort },
        { label: localizationStore.getString('Buttons.Info'), icon: "info", onClick: () => jQuery('#libraryVideo').modal() },
    ]

    return <div className='row background-lib height-100'>
        <NavMenu {...props} />
        <div className='mx-2 mx-md-5 w-100 main-content'>
            {
                competencyStore.isLoading ?
                    <Loader text={localizationStore.getString('Library.Loading')} /> :
                    numericSort ?
                        <CompetencyList competencies={competencyStore.competencies} renderCompetency={CompetencyItemFunction} /> :
                        <FactorList factors={competencyStore.factors} renderCompetency={CompetencyItemFunction} animate={true} />
            }
            <StoppersList animate={true} renderStopper={StopperItemFunction} />
            <FloatingActionButtons floatingButtons={floatingButtons} />
            <VideoModal id='libraryVideo' videoId='2Kwp81JJLgM' />
        </div>
    </div>
}