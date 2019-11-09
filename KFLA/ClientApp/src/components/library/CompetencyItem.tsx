import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Competency } from '../../models/Competency';

interface CompetencyItemProps extends RouteComponentProps<{}> {
    competency: Competency;
}

const CompetencyItem: React.FC<CompetencyItemProps> = props => {
    const { competency, match, history } = props;

    const openCompetency = (competencyId: number) => {
        history.push(`${match.url}/competencies/${competencyId}`);
    }

    return <div>
        <div className='row competency-as-button pointer' onClick={() => openCompetency(competency.ID)}>
            <div className='col-1 p-0 text-right'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <p className='font-weight-bold'>{competency.Name}</p>
                <p>{competency.Description}</p>
            </div>
        </div>
    </div>
}

export default withRouter(CompetencyItem);

