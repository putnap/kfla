import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import NavMenu from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { CompetencyItem } from './CompetencyItem';
import { StoppersList } from '../StoppersList';
import { CompetencyList } from './CompetencyList';
import { VideoModal } from '../VideoModal';
import { StopperItem } from './StopperItem';
import { Stopper } from '../../models/Stopper';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { LanguageParam } from '../../@types/types';

interface LibraryContainerProps extends RouteComponentProps<LanguageParam> {
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore;
}

interface LibraryContainerState {
    numericSort: boolean
}

@inject("competencyStore", "localizationStore")
@observer
export class LibraryContainer extends React.Component<LibraryContainerProps, LibraryContainerState> {

    constructor(props: LibraryContainerProps) {
        super(props);

        this.state = {
            numericSort: false
        };

        this.renderCompetency = this.renderCompetency.bind(this);
        this.renderStopper = this.renderStopper.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }      

    async componentDidMount() {
        this.props.localizationStore.setTitle('PageTitles.LIBRARY');
        const { competencyStore } = this.props;
        if (!competencyStore.isLoaded)
            await competencyStore.fetchCompetencies();
    }

    showInfo() {
        jQuery('#libraryVideo').modal();
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <CompetencyItem competency={competency} key={competency.ID} {...this.props} />
    }

    changeSort() {
        this.setState({ numericSort: !this.state.numericSort });
    }

    renderStopper(stopper: Stopper): JSX.Element {
        return <StopperItem stopper={stopper} key={stopper.ID} {...this.props} />
    }

    public render() {
        const { competencyStore } = this.props;
        return <div className='row background-lib height-100'>
            <NavMenu {...this.props} />
            <div className='mx-2 mx-md-5 w-100 main-content'>
                {
                    competencyStore.isLoading ?
                        <Loader text={this.props.localizationStore.getString('Library.Loading')} /> :
                        this.state.numericSort ?
                            <CompetencyList competencies={competencyStore.competencies} renderCompetency={this.renderCompetency} /> :
                            <FactorList factors={competencyStore.factors} renderCompetency={this.renderCompetency} animate={true} />
                }
                <StoppersList animate={true} renderStopper={this.renderStopper} />
                <div className='btn-floating-container'>
                    <button onClick={this.changeSort} className='btn rounded-circle' title={this.props.localizationStore.getString('Library.SortByNumber')} hidden={this.state.numericSort}>
                        <FontAwesomeIcon icon='sort-numeric-down' />
                    </button>
                    <button onClick={this.changeSort} className='btn rounded-circle' title={this.props.localizationStore.getString('Library.SortByFactors')} hidden={!this.state.numericSort}>
                        <FontAwesomeIcon icon='sort-amount-down' />
                    </button>
                    <button onClick={this.showInfo} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Info')}>
                        <FontAwesomeIcon icon='info' />
                    </button>
                </div>
                <VideoModal id='libraryVideo' videoId='XINbgbwJ0PQ' />
            </div>
        </div>;
        
    }
}