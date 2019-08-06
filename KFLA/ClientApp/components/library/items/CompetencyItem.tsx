import * as React from 'react';
import ReactLinkify from 'react-linkify';
import { Route, RouteComponentProps } from 'react-router';
import { Competency } from '../../../models/Competency';
import { LocalizationStore } from '../../../stores/LocalizationStore';
import { inject } from 'mobx-react';
import { generateDroprightButton, safeReplace } from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { printList } from '../../skillPrinter';

interface CompetencyItemProps extends RouteComponentProps<{}> {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    render() {
        const { competency, localizationStore, match } = this.props;

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
                    <div className='slideout-menu'>
                        {generateDroprightButton(match.url, 'Info', 'info', competency.Name)}
                        {generateDroprightButton(match.url, 'Skills', 'user', localizationStore.getString('Skills.SKILLED'))}
                        {generateDroprightButton(match.url, 'PossibleCauses', 'sitemap', localizationStore.getString('Library.Items.Links.PossibleCauses'))}
                        {generateDroprightButton(match.url, 'Tips', 'brain', safeReplace(localizationStore.getString('Library.Items.Links.Tips'), competency.Name))}
                        {generateDroprightButton(match.url, 'Jobs', 'tasks', localizationStore.getString('Library.Items.Links.Jobs'))}
                        {generateDroprightButton(match.url, 'Reflect', 'history', localizationStore.getString('Library.Items.Links.Reflect'))}
                        {generateDroprightButton(match.url, 'LearnMore', ['fab', 'leanpub'], safeReplace(localizationStore.getString('Library.Items.Links.LearnMore'), competency.Name))}
                        {generateDroprightButton(match.url, 'DeepDive', 'link', localizationStore.getString('Library.Items.Links.DeepDive'))}
                    </div>
                </div>
                <div className='col'>
                    <Route
                        exact
                        path={`${this.props.match.path}`}
                        render={() => <Info {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/Skills`}
                        render={() => <Skills {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/PossibleCauses`}
                        render={() => <PossibleCauses {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/Tips`}
                        render={() => <Tips {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/Jobs`}
                        render={() => <JobAssignments {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/Reflect`}
                        render={() => <TimeToReflect {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/LearnMore`}
                        render={() => <LearnMore {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/DeepDive`}
                        render={() => <DeepDive {...this.props} />} />
                    <Route
                        path={`${this.props.match.path}/Info`}
                        render={() => <Info {...this.props} />} />
                </div>
            </div>
        </div>
    }
}

interface CompetencyDetails {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

export class Info extends React.Component<CompetencyDetails, {}> {
    render() {
        const competency = this.props.competency;
        return <div className='row'>
            <div className='col'>
                <p className='font-italic h5 pb-3'>{competency.Description}</p>
                <p>{competency.Context}</p>
                <p className='mx-auto py-2 w-50'>{competency.Quotes[0]}</p>
                <p><FontAwesomeIcon icon='lightbulb' /><span className='pl-2'>{competency.Positioning}</span></p>
            </div>
        </div>
    }
}

export class Skills extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.SKILLED')}</span></p>
                {printList(competency.Skilled)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.LESS')}</span></p>
                {printList(competency.LessSkilled)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='gem' /><span className='pl-2'>{localizationStore.getString('Skills.TALENTED')}</span></p>
                {printList(competency.Talented)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{localizationStore.getString('Skills.OVERUSED')}</span></p>
                {printList(competency.OverusedSkill)}
            </div>
        </div>
    }
}

export class PossibleCauses extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.Competency.PossibleCauses')}</h5>
                <p>{safeReplace(localizationStore.getString('Library.Item.Competency.PossibleCauses.Description'), competency.Name)}</p>
                {printList(competency.Causes)}
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

export class Tips extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{safeReplace(localizationStore.getString('Library.Item.Competency.Tips'), competency.Name)}</h5>
            </div>
            {competency.Tips.map((tip, i) => {
                return <div className='col-12 py-1' key={i}>
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

export class JobAssignments extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.JobAssignments')}</h5>
            </div>
            {printList(competency.JobAssignments)}
        </div>
    }
}

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

export class LearnMore extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row'>
            <div className='col-12'>
                <h5>{safeReplace(localizationStore.getString('Library.Item.LearnMore'), competency.Name)}</h5>
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
        return <ReactLinkify componentDecorator={this.targetBlankDecorator}>
            <div className='row'>
                <div className='col-12'>
                    <h5>{localizationStore.getString('Library.Item.DeepDive')}</h5>
                </div>
                <div className='col-12'>
                    {competency.DeepDiveResources.map((resource, i) => <p className='py-1' key={i}>{resource}</p>)}
                </div>
                <div className='col-12'>
                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='cloud-download-alt' /><span className='pl-2'>{localizationStore.getString('Library.Item.MoreHelp.Title')}</span></p>
                    <p>{localizationStore.getString('Library.Item.MoreHelp.Content')}</p>
                </div>
            </div>
        </ReactLinkify>
    }
}


