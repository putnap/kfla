import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Competency } from '../../models/Competency';
import { observer, inject } from 'mobx-react';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface CompetencyItemProps extends Partial<RouteComponentProps<{}>> {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    constructor(props: CompetencyItemProps) {
        super(props);

        this.openCompetency = this.openCompetency.bind(this);
    }

    openCompetency(competencyId: number) {
        const { match } = this.props;
        this.props.history.push(`${match.url}/competencies/${competencyId}`);
    }

    printSkills(skills: string[], classes?: string) {
        return <ul>
            {skills.map(i => {
                if (i)
                    return <li key={i}><p className={`class-text ${classes}`} style={{ fontSize: '80%' }}>{i}</p></li>;
            })}
        </ul>
    }

    render() {
        const { competency } = this.props;
        return <div>
            <div className='row competency-as-button pointer' onClick={() => this.openCompetency(competency.ID)}>
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
}


