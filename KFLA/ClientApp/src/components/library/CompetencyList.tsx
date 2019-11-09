import * as React from 'react'; 
import { Competency } from '../../models/Competency';

interface CompetencyListProps {
    competencies: Competency[];
    renderCompetency: (competency: Competency) => JSX.Element;
}

const buildColumns = (numberOfColumns: number, competencies: Competency[]) => {
    const itemsPerColumn: number = Math.ceil(competencies.length / numberOfColumns);
    const rows: Competency[][] = [];
    competencies.forEach((competency, index) => {
        const rowIndex = index % itemsPerColumn;
        if (!rows[rowIndex])
            rows[rowIndex] = [];
        rows[rowIndex].push(competency);
    });

    return rows;
}

const getNumberOfColumns = () => {
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

export const CompetencyList: React.FC<CompetencyListProps> = props => {

    const [numberOfColumns, setNumberOfColumns] = React.useState(getNumberOfColumns())
    const [rows, setRows] = React.useState(buildColumns(numberOfColumns, props.competencies))

    const resizeCallback = React.useCallback(() => {
        setNumberOfColumns(getNumberOfColumns());
    }, []);

    const numberOfColumnsChangeCallback = React.useCallback(() => {
        setRows(buildColumns(numberOfColumns, props.competencies));
    }, []);

    React.useEffect(numberOfColumnsChangeCallback, [numberOfColumns]);
    React.useEffect(() => {
        window.addEventListener("resize", resizeCallback);
        return () => window.removeEventListener("resize", resizeCallback);
    }, [event, resizeCallback]);

    return <div className='row card mb-2'>
        <div className='col card-body'>
            {
                rows.map(row => {
                    return <div className='row'>
                        {
                            row.map(competency => {
                                return <div className='col-sm-12 col-md-6 col-xl-3'>
                                    {props.renderCompetency(competency)}
                                </div>;
                            })
                        }
                    </div>
                })
            }
        </div>
    </div>
}
