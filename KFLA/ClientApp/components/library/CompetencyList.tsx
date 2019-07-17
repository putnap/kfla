import * as React from 'react'; 
import { render } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { Competency } from '../../models/Competency';

interface CompetencyListState {
    numberOfColumns: number;
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

        const numberOfColumns = this.getNumberOfColumns();
        const rows = this.buildColumns(numberOfColumns);
        this.state = { numberOfColumns: numberOfColumns, rows: rows };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.buildColumns = this.buildColumns.bind(this); 
        this.getNumberOfColumns = this.getNumberOfColumns.bind(this);
    }

    updateDimensions() {
        const numberOfColumns = this.getNumberOfColumns();
        if (numberOfColumns == this.state.numberOfColumns)
            return;

        const rows = this.buildColumns(numberOfColumns);

        this.setState({ numberOfColumns: numberOfColumns, rows: rows });
    }

    getNumberOfColumns(): number {
        const w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth;

        let numberOfColumns: number;

        if (width >= 1200) {
            numberOfColumns = 4;
        }
        else if (width >= 768) {
            numberOfColumns = 2;
        }
        else
            numberOfColumns = 1;

        return numberOfColumns;
    }

    buildColumns(numberOfColumns: number): Competency[][]{
        const itemsPerColumn: number = Math.ceil(this.props.competencies.length / numberOfColumns);
        const rows: Competency[][] = [];
        this.props.competencies.map((competency, index) => {
            const rowIndex = index % itemsPerColumn;
            if (!rows[rowIndex])
                rows[rowIndex] = [];
            rows[rowIndex].push(competency);
        });

        return rows;
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        return <div className='row card mb-2'>
            <div className='col card-body'>
                {
                    this.state.rows.map(row => {
                        return <div className='row'>
                            {
                                row.map(competency => {
                                    return <div className='col-sm-12 col-md-6 col-xl-3'>
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
