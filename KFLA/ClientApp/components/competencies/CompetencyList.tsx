import * as React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { CompetencyItem } from './CompetencyItem';
import { CompetencyStore } from '../../stores/CompetencyStore';

interface CompetencyListProps {
    competencyStore: CompetencyStore
}

@observer
export class CompetencyList extends React.Component<CompetencyListProps, {}> {

    render() {
        const store = this.props.competencyStore;
        return (
            <div className='row animate-bottom'>
                {
                    store.uneavluatedCompetencies.map(competency => {
                        return <CompetencyItem competency={competency} key={competency.ID} />
                    })
                }
            </div>
        )
    }

}
