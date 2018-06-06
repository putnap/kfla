import * as React from 'react';
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { CompetencyItem } from './CompetencyItem';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';

interface CompetencyListProps {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class CompetencyList extends React.Component<CompetencyListProps, {}> {

    componentDidMount() {
        const store = this.props.competencyStore;
        if (!store!.isLoaded)
            store!.fetchCompetencies();
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <CompetencyItem competency={competency} />
    }

    render() {
        const store = this.props.competencyStore!;
        return store.isLoading ? <Loader text='Loading competencies...' /> : <FactorList factors={store.factors} renderCompetency={this.renderCompetency} animate={true} />
    }

}
