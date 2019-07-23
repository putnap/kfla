import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { Competency } from '../../models/Competency';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ReactLinkify from 'react-linkify';

interface CompetencyItemProps extends Partial<RouteComponentProps<{}>> {
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
                    <li><Link to={`${this.props.match.url}/PossibleCauses`}>Possible Causes</Link></li>
                    <li><Link to={`${this.props.match.url}/Tips`}>Tips</Link></li>
                    <li><Link to={`${this.props.match.url}/Jobs`}>Jobs</Link></li>
                    <li><Link to={`${this.props.match.url}/Reflect`}>Take time to reflect</Link></li>
                    <li><Link to={`${this.props.match.url}/LearnMore`}>Learn More</Link></li>
                    <li><Link to={`${this.props.match.url}/DeepDive`}>Deep dive</Link></li>
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
                <Route
                    path={`${this.props.match.path}/Tips`}
                    component={() => <Tips competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/Jobs`}
                    component={() => <JobAssignments competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/Reflect`}
                    component={() => <TimeToReflect competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/LearnMore`}
                    component={() => <LearnMore competency={competency} />} />
                <Route
                    path={`${this.props.match.path}/DeepDive`}
                    component={() => <DeepDive competency={competency} />} />
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
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.PossibleCauses')}</h5>
                <p>{localizationStore.getString('Library.Item.PossibleCauses.Description')}</p>
                {printSkills(competency.Causes)}
            </div>
            {competency.CaseStudies.length > 0 &&
                <div className='col-12'>
                    <h5 className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' /><span className='pl-2'>{competency.CaseStudies[0].Type}</span></h5>
                    <p>{competency.CaseStudies[0].Case}</p>
                </div>
            }
        </div>
    }
}

@inject("localizationStore")
export class Tips extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.Tips')}</h5>
            </div>
            {competency.Tips.map((tip, i) => {
                return <div className='col-12'>
                    <p><b>{i + 1}. {tip.Phrase}</b> {tip.TipContent}</p>
                    {tip.WantToLearnMore.length > 0 &&
                        <div>
                            <h5>{localizationStore.getString('Library.Item.Tip.WantToLearnMore')}</h5>
                            {tip.WantToLearnMore.map((learnMore, i) => <p key={i}>{learnMore}</p>)}
                        </div>
                    }
                </div>
            })
            }
        </div>
    }
}

@inject("localizationStore")
export class JobAssignments extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.JobAssignments')}</h5>
            </div>
            <ul>
                {competency.JobAssignments.map((job, i) => <li key={i}>{job}</li>)}
            </ul>
        </div>
    }
}

@inject("localizationStore")
export class TimeToReflect extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.TimeToReflect')}</h5>
            </div>
            {competency.TimeToReflect.map((timeToReflect, i) => {
                return <div className='col-12' key={i}>
                    <p className='font-italic'>{timeToReflect.Statement}</p>
                    <p className='pl-3'>{timeToReflect.Suggestion}</p>
                </div>
            })
            }
            <div className='col-12 pt-5'>
                <p>{competency.Quotes[1]}</p>
            </div>
        </div>
    }
}

@inject("localizationStore")
export class LearnMore extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.LearnMore')}</h5>
            </div>
            {competency.LearnMore.map((learnMore, i) => {
                return <div className='col-12' key={i}>
                    <p>{learnMore}</p>
                </div>
            })
            }
        </div>
    }
}

@inject("localizationStore")
export class DeepDive extends React.Component<CompetencyDetails, {}> {

    targetBlankDecorator(decoratedHref: string, decoratedText: string, key: number): React.Node {
        return (
            <a target='_blank' href={decoratedHref} key={key}>
                {decoratedText}
            </a>
        );
    }

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.DeepDive')}</h5>
            </div>
            <ReactLinkify componentDecorator={this.targetBlankDecorator}>
                <div className='col-12'>
                    {competency.DeepDiveResources.map((resource, i) => <p key={i}>{resource}</p>)}
                </div>
            </ReactLinkify>
            <div className='col-12'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='cloud-download-alt' /><span className='pl-2'>{localizationStore.getString('Library.Item.MoreHelp.Title')}</span></p>
                <p>{localizationStore.getString('Library.Item.MoreHelp.Content')}</p>
            </div>
        </div>
    }
}

