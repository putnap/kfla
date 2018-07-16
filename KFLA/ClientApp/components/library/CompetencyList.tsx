import * as React from 'react'; 
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';
import { CompetencyItem } from './CompetencyItem';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';

interface CompetencyListState {
    rows: Competency[][];
}

interface CompetencyListProps {
    competencies: Competency[];
    renderCompetency: (competency: Competency) => JSX.Element;
}

@observer
export class CompetencyList extends React.Component<CompetencyListProps, CompetencyListState> {

    constructor(props: CompetencyListProps) {
        super(props);

        const numberOfColumns: number = 4;
        const itemsPerColumn: number = Math.ceil(props.competencies.length / 4);
        const rows: Competency[][] = [];
        props.competencies.map((competency, index) => {
            const rowIndex = index % itemsPerColumn;
            if (!rows[rowIndex])
                rows[rowIndex] = [];
            rows[rowIndex].push(competency);
        });
        this.state = { rows: rows };
    }

    render() {
        return <div className='row card mb-2'>
            <div className='col card-body'>
                {
                    this.state.rows.map(row => {
                        return <div className='row'>
                            {
                                row.map(competency => {
                                    return <div className='col-3'>
                                        {this.props.renderCompetency(competency)}
                                    </div>;
                                })
                            }
                            </div>
                    })
                }
            </div>
        </div>
    }
}
