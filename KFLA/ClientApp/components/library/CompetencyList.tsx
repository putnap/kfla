import * as React from 'react';
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { CompetencyItem } from './CompetencyItem';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';

interface CompetencyListProps {
    competencies: Competency[];
    renderCompetency: (competency: Competency) => JSX.Element;
}

@observer
export class CompetencyList extends React.Component<CompetencyListProps, {}> {

    render() {
        return <div className='row card mb-2'>
            <div className='col card-body row'>
                {
                    this.props.competencies.map(competency => {
                        return <div className='col-3'>
                            {this.props.renderCompetency(competency)}
                        </div>;
                    })
                }
            </div>
        </div>
    }
}
