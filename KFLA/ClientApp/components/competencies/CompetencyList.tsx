import * as React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { CompetencyItem } from './CompetencyItem';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { EmptyListWarning } from '../EmptyListWarning';

interface CompetencyListProps {
    competencyStore: CompetencyStore
}

@observer
export class CompetencyList extends React.Component<CompetencyListProps, {}> {

    render() {
        const store = this.props.competencyStore;
        const isEmpty = store.competencies.length == 0;
        return (
            <div className='row px-5'>
                {
                    isEmpty ? <EmptyListWarning /> :
                    store.uneavluatedCompetencies.map(competency => {
                        return <CompetencyItem competency={competency} key={competency.ID} />
                    })
                }
            </div>
        )
    }

}
