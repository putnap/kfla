import * as React from 'react';
import ReactLinkify from 'react-linkify';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router';
import { Competency } from '../../../models/Competency';
import { LocalizationStore } from '../../../stores/LocalizationStore';
import { inject } from 'mobx-react';
import { safeReplace, printList, DroprightButton, ContextWithQuote, Quote, CollapsableTip } from './shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                <div className='col d-flex flex-column flex-md-row'>
                    <div className='order-1 flex-grow-1'><h2 className='font-weight-bold mx-3 mb-2'>{competency.ID}. {competency.Name}</h2></div>
                    <div className='order-0 order-md-2 mx-3 mb-2 d-flex flex-column align-items-md-end small'>
                        <div><b>{localizationStore.getString('Factor')} {competency.Factor.ID}:</b> {competency.Factor.Name}</div>
                        <div><b>{localizationStore.getString('Cluster')} {competency.Cluster.ID}:</b> {competency.Cluster.Name}</div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col d-flex'>
                    <div className='slideout-menu' style={{ position: "relative", width: '56px' }}>
                        <DroprightButton link='Skills' icon='user'>{localizationStore.getString('Skills.SKILLED')}</DroprightButton>
                        <DroprightButton link='Info' icon='info'>{competency.Name}</DroprightButton>
                        <DroprightButton link='PossibleCauses' icon='sitemap'>{localizationStore.getString('Library.Items.Links.PossibleCauses')}</DroprightButton>
                        <DroprightButton link='Tips' icon='brain'>{safeReplace(localizationStore.getString('Library.Items.Links.Tips'), competency.Name)}</DroprightButton>
                        <DroprightButton link='Jobs' icon='tasks'>{localizationStore.getString('Library.Items.Links.Jobs')}</DroprightButton>
                        <DroprightButton link='Reflect' icon='history'>{localizationStore.getString('Library.Items.Links.Reflect')}</DroprightButton>
                        <DroprightButton link='LearnMore' icon={['fab', 'leanpub']}>{safeReplace(localizationStore.getString('Library.Items.Links.LearnMore'), competency.Name)}</DroprightButton>
                    </div>
                    <div className='my-3 mx-3 mx-md-5' style={{ width: '100%' }}>
                        <Switch>
                            <Route
                                path={`${this.props.match.path}/Skills`}
                                render={() => <Skills {...this.props} />} />
                            <Route
                                path={`${this.props.match.path}/Info`}
                                render={() => <Info {...this.props} />} />
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
                            <Redirect to={`${this.props.match.path}/Skills`} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    }
}

interface CompetencyDetails {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

const Info: React.FunctionComponent<CompetencyDetails> = props => {
    const competency = props.competency;

    return <div className='row animate-bottom'>
        <div className='col'>
            <div className='font-italic h5'>{competency.Description}</div>
            <ContextWithQuote context={competency.Context} quote={competency.Quotes[0]} />
            <div><FontAwesomeIcon icon='lightbulb' /><span className='pl-2'>{competency.Positioning}</span></div>
        </div>
    </div>
}

const Skills: React.FunctionComponent<CompetencyDetails> = props => {
    const { competency, localizationStore } = props;

    return <div className='row animate-bottom'>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold'><FontAwesomeIcon className='item-skill-icon' icon='plus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.SKILLED')}</span></p>
            {printList(competency.Skilled)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold'><FontAwesomeIcon className='item-skill-icon' icon='minus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.LESS')}</span></p>
            {printList(competency.LessSkilled)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold'><FontAwesomeIcon className='item-skill-icon' icon='gem' /><span className='pl-2'>{localizationStore.getString('Skills.TALENTED')}</span></p>
            {printList(competency.Talented)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold'><FontAwesomeIcon className='item-skill-icon' icon='exclamation-circle' /><span className='pl-2'>{localizationStore.getString('Skills.OVERUSED')}</span></p>
            {printList(competency.OverusedSkill)}
        </div>
    </div>
}

export class PossibleCauses extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row animate-bottom'>
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
        return <div className='row animate-bottom'>
            <div className='col-12'>
                <h5>{safeReplace(localizationStore.getString('Library.Item.Competency.Tips'), competency.Name)}</h5>
            </div>
            {competency.Tips.map((tip, i) => {
                return <CollapsableTip index={i} phrase={tip.Phrase} content={tip.TipContent} key={i}>
                    {tip.WantToLearnMore.length > 0 &&
                        <div className='border p-2 my-2'>
                            <h5><FontAwesomeIcon icon='user-graduate' /><span className='pl-2'>{localizationStore.getString('Library.Item.Tip.WantToLearnMore')}</span></h5>
                            {tip.WantToLearnMore.map((learnMore, i) => <p key={i}>{learnMore}</p>)}
                        </div>
                    }
                </CollapsableTip>
            })
            }
        </div>
    }
}

export class JobAssignments extends React.Component<CompetencyDetails, {}> {

    render() {
        const { competency, localizationStore } = this.props;
        return <div className='row animate-bottom'>
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
        return <div className='row animate-bottom'>
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
            <Quote quote={competency.Quotes[1]} />
        </div>
    }
}

export class LearnMore extends React.Component<CompetencyDetails, {}> {

    targetBlankDecorator(decoratedHref: string, decoratedText: string, key: number) {
        return (
            <a className='dont-break-out' target='_blank' href={decoratedHref} key={key}>
                {decoratedText}
            </a>
        );
    }

    render() {
        const { competency, localizationStore } = this.props;
        return <ReactLinkify componentDecorator={this.targetBlankDecorator}>
            <div className='row animate-bottom'>
                <div className='col-12'>
                    <h5>{safeReplace(localizationStore.getString('Library.Item.LearnMore'), competency.Name)}</h5>
                </div>
                {competency.LearnMore.map((learnMore, i) => {
                    return <div className='col-12 py-1' key={i}>
                        <p>{learnMore}</p>
                    </div>
                })
                }

                <div className='col-12 pt-3'>
                    <h5>{localizationStore.getString('Library.Item.DeepDive')}</h5>
                </div>
                <div className='col-12'>
                    {competency.DeepDiveResources.map((resource, i) => <p className='py-1' key={i}>{resource}</p>)}
                </div>
                <div className='col-12 pt-3'>
                    <p className='card-text font-weight-bold'><FontAwesomeIcon icon='cloud-download-alt' /><span className='pl-2'>{localizationStore.getString('Library.Item.MoreHelp.Title')}</span></p>
                    <p>{localizationStore.getString('Library.Item.MoreHelp.Content')}</p>
                </div>
            </div>
        </ReactLinkify>
    }
}


