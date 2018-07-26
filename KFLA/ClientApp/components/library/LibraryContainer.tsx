import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { PageTitles } from '../../@types/types';
import { CompetencyItem } from './CompetencyItem';
import { StoppersList } from '../StoppersList';
import { CompetencyList } from './CompetencyList';
import { VideoModal } from '../VideoModal';
import { StopperItem } from './StopperItem';
import { Stopper } from '../../models/Stopper';

interface LibraryContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

interface LibraryContainerState {
    numericSort: boolean
}

@inject("competencyStore")
@observer
export class LibraryContainer extends React.Component<LibraryContainerProps, LibraryContainerState> {

    constructor(props: LibraryContainerProps) {
        super(props);

        this.state = {
            numericSort: false
        };
    }      

    componentDidMount() {
        document.title = PageTitles.LIBRARY;
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
    }

    showInfo() {
        jQuery('#libraryVideo').modal();
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <CompetencyItem competency={competency} />
    }

    changeSort() {
        this.setState({ numericSort: !this.state.numericSort });
    }

    renderStopper(stopper: Stopper): JSX.Element {
        return <StopperItem stopper={stopper} />
    }

    public render() {
        const store = this.props.competencyStore!;
        return <div className='row background-lib height-100'>
            <NavMenu />
            <div className='mx-5 w-100' style={{ padding: '65px 15px 0px 15px' }}>
                {
                    store.isLoading ?
                        <Loader text='Loading competencies...' /> :
                        this.state.numericSort ?
                            <CompetencyList competencies={store.competencies} renderCompetency={this.renderCompetency} /> :
                            <FactorList factors={store.factors} renderCompetency={this.renderCompetency} animate={true} />
                }
                <StoppersList animate={true} renderStopper={this.renderStopper} />
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.changeSort()} className='btn rounded-circle' title='Sort by Competency number' hidden={this.state.numericSort}>
                        <FontAwesomeIcon icon='sort-numeric-down' />
                    </button>
                    <button onClick={(e) => this.changeSort()} className='btn rounded-circle' title='Sort by Factors and Clusters' hidden={!this.state.numericSort}>
                        <FontAwesomeIcon icon='sort-amount-down' />
                    </button>
                    <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title='Info'>
                        <FontAwesomeIcon icon='info' />
                    </button>
                </div>
                <VideoModal id='libraryVideo' url='Videos/library.mp4' />
            </div>
        </div>;
        
    }
}