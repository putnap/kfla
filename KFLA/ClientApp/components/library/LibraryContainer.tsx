import * as React from 'react';
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

interface LibraryContainerProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class LibraryContainer extends React.Component<LibraryContainerProps, {}> {

    componentDidMount() {
        document.title = PageTitles.LIBRARY;
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <CompetencyItem competency={competency} />
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='row background-lib'>
                <NavMenu />
            </div>
            <div className='row background-lib contentContainer height-100 px-5'>
                <div className='col'>
                    {
                        store!.isLoading ? <Loader text='Loading competencies...' /> : <FactorList factors={store.factors} renderCompetency={this.renderCompetency} animate={true} />
                    }
                </div>
            </div>
        </section>;
        
    }
}