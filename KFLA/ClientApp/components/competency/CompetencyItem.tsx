import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { Competency } from '../../models/Competency';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ReactLinkify from 'react-linkify';
import { printSkills } from '../skillPrinter';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CompetencyItemProps extends Partial<RouteComponentProps<{}>> {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

const iconStyle: React.CSSProperties = {
    margin: '10px 5px'
};

@inject("localizationStore")
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    constructor(props: CompetencyItemProps) {
        super(props);

        this.generateButton = this.generateButton.bind(this);
        this.generateLink = this.generateLink.bind(this);
    }

    generateButton(link: string, icon: IconProp) {
        return <div className='dropright'>
            <button type='button' className='btn dropdown-toggle-split rounded-0 background-lib' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                <FontAwesomeIcon style={iconStyle} fixedWidth icon={icon} />
            </button>
            <div className='dropdown-menu m-0 rounded-0 border-0 background-lib' style={{ height: '54px' }}>
                {this.generateLink(link)}
            </div>
        </div>
    }

    generateLink(link: string) {
        const localizationStore = this.props.localizationStore;
        return <div className='my-auto'>
            <Link className='text-dark' to={`${this.props.match.url}/${link}`}><span className='pl-2'>{localizationStore.getString(`Library.Items.Links.${link}`)}</span></Link>
        </div>
    }

    render() {
        const { competency, localizationStore } = this.props;
        const sideBarStyle: React.CSSProperties = {
            width: '50px',
            marginLeft: '-21px',
        };

        return <div>
            <div className='row'>
                <div className='col-sm-12 col-md-8'>
                    <h2 className='font-weight-bold mx-3 mb-2'>{competency.ID}. {competency.Name}</h2>
                </div>
                <div className='col-sm-12 col-md-4'>
                    <p><b>{localizationStore.getString('Factor')} {competency.Factor.ID}:</b> {competency.Factor.Name}</p>
                    <p><b>{localizationStore.getString('Cluster')} {competency.Cluster.ID}:</b> {competency.Cluster.Name}</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div style={sideBarStyle}>
                        {this.generateButton('Info', 'info')}
                        {this.generateButton('Skills', 'user')}
                        {this.generateButton('PossibleCauses', 'sitemap')}
                        {this.generateButton('Tips', 'brain')}
                        {this.generateButton('Jobs', 'tasks')}
                        {this.generateButton('Reflect', 'history')}
                        {this.generateButton('LearnMore', ['fab', 'leanpub'])}
                        {this.generateButton('DeepDive', 'link')}
                    </div>
                </div>
                <div className='col'>
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
                    <Route
                        path={`${this.props.match.path}/Info`}
                        component={() => <Info competency={competency} />} />
                </div>
            </div>

        </div >
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
                <p className='mx-auto py-2 w-50'>{competency.Quotes[0]}</p>
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
                return <div className='col-12 py-1'>
                    <p><b>{i + 1}. {tip.Phrase}</b> {tip.TipContent}</p>
                    {tip.WantToLearnMore.length > 0 &&
                        <div className='border p-2 my-2'>
                            <h5><FontAwesomeIcon icon='user-graduate' /><span className='pl-2'>{localizationStore.getString('Library.Item.Tip.WantToLearnMore')}</span></h5>
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
            {printSkills(competency.JobAssignments)}
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
                return <div className='col-12 py-1' key={i}>
                    <p className='font-italic'>{timeToReflect.Statement}</p>
                    <p className='pl-3'>{timeToReflect.Suggestion}</p>
                </div>
            })
            }
            <div className='col-12 pt-5'>
                <p className='mx-auto py-2 w-50'>{competency.Quotes[1]}</p>
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
                return <div className='col-12 py-1' key={i}>
                    <p>{learnMore}</p>
                </div>
            })
            }
        </div>
    }
}

@inject("localizationStore")
export class DeepDive extends React.Component<CompetencyDetails, {}> {

    targetBlankDecorator(decoratedHref: string, decoratedText: string, key: number) {
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
                    {competency.DeepDiveResources.map((resource, i) => <p className='py-1' key={i}>{resource}</p>)}
                </div>
            </ReactLinkify>
            <div className='col-12'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='cloud-download-alt' /><span className='pl-2'>{localizationStore.getString('Library.Item.MoreHelp.Title')}</span></p>
                <p>{localizationStore.getString('Library.Item.MoreHelp.Content')}</p>
            </div>
        </div>
    }
}

