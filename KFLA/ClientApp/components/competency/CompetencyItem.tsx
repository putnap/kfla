import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { Competency } from '../../models/Competency';
import { render } from 'react-dom';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

interface CompetencyItemProps extends RouteComponentProps<{}> {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@withRouter
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    render() {
        const competency = this.props.competency;
        return <div className='row'>
            <div className='col'>
                <div>
                    <p className='font-weight-bold'>{competency.ID}. {competency.Name}</p>
                </div>
                <ul>
                    <li><Link to={`${this.props.match.url}`}>Info</Link></li>
                    <li><Link to={`${this.props.match.url}/Skills`}>Skills</Link></li>
                    <li><Link to={`${this.props.match.url}/PossibleCauses`}>PossibleCauses</Link></li>
                </ul>

                <Route
                    exact
                    path={`${this.props.match.path}`}
                    component={() => <Info competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/Skills`}
                    component={() => <Skills competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/PossibleCauses`}
                    component={() => <PossibleCauses competency={competency} />} />
            </div>
        </div>
    }
}

interface CompetencyDetails {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class Info extends React.Component<CompetencyDetails, {}> {
    render() {
        const competency = this.props.competency;
        return <div className='row'>
            <div className='col'>
                <p>{competency.Description}</p>
                <p>{competency.Context}</p>
                <p>{competency.Quotes[0]}</p>
                <p><FontAwesomeIcon icon='lightbulb' /><span className='pl-2'>{competency.Positioning}</span></p>
            </div>
        </div>
    }
}

@inject("localizationStore")
export class Skills extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.SKILLED')}</span></p>
                {printSkills(competency.Skilled)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.LESS')}</span></p>
                {printSkills(competency.LessSkilled)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='gem' /><span className='pl-2'>{localizationStore.getString('Skills.TALENTED')}</span></p>
                {printSkills(competency.Talented)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{localizationStore.getString('Skills.OVERUSED')}</span></p>
                {printSkills(competency.OverusedSkill)}
            </div>
        </div>
    }
}

function printSkills(skills: string[], classes?: string) {
    return <ul>
        {skills.map(i => {
            return <li key={i}><p className={`class-text ${classes}`} style={{ fontSize: '80%' }}>{i}</p></li>;
        })}
    </ul>
}

@inject("localizationStore")
export class PossibleCauses extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col'>
                <h5>{localizationStore.getString('Library.Item.PossibleCauses')}</h5>
                <p>{localizationStore.getString('Library.Item.PossibleCauses.Description')}</p>
                {printSkills(competency.Causes)}
            </div>
                <div className='col'>
                    <h5 className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' /><span className='pl-2'></span></h5>
                    <p>{competency.CaseStudies[1]}</p>
                </div>
        </div>
    }
}


