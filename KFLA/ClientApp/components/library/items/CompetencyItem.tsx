import * as React from 'react';
import ReactLinkify from 'react-linkify';
import { Route, RouteComponentProps, Switch, Redirect, withRouter } from 'react-router';
import { Competency } from '@Models/Competency';
import { safeReplace, printList, ContextWithQuote, Quote, CollapsableTip, DropRightMenuItemProps, DropRightMenu } from './shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@Stores/hook';

interface CompetencyItemProps extends RouteComponentProps<{}> {
    competency: Competency;
}

const CompetencyItem: React.FunctionComponent<CompetencyItemProps> = props => {

    const localizationStore = useStore(stores => stores.localizationStore);
    const { competency, match: { path } } = props;

    const menuItems: DropRightMenuItemProps[] = [
        { link: 'Scales', icon: 'balance-scale', linkText: localizationStore.getString('Library.Items.Links.Scales') },
        { link: 'Overview', icon: 'info', linkText: localizationStore.getString('Library.Items.Links.Overview') },
        { link: 'PossibleCauses', icon: 'sitemap', linkText: localizationStore.getString('Library.Items.Links.PossibleCauses') },
        { link: 'Tips', icon: 'brain', linkText: localizationStore.getString('Library.Items.Links.Tips') },
        { link: 'Jobs', icon: 'briefcase', linkText: localizationStore.getString('Library.Items.Links.Jobs') },
        { link: 'Reflect', icon: 'history', linkText: localizationStore.getString('Library.Items.Links.Reflect') },
        { link: 'LearnMore', icon: ['fab', 'leanpub'], linkText: localizationStore.getString('Library.Items.Links.LearnMore') },
    ];

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
                <DropRightMenu menuItems={menuItems} />
                <div className='my-3 mx-3 mx-md-5' style={{ width: '100%' }}>
                    <Switch>
                        <Route
                            path={`${path}/Scales`}
                            render={() => <Scales competency={competency} />} />
                        <Route
                            path={`${path}/Overview`}
                            render={() => <Overview competency={competency} />} />
                        <Route
                            path={`${path}/PossibleCauses`}
                            render={() => <PossibleCauses competency={competency} />} />
                        <Route
                            path={`${path}/Tips`}
                            render={() => <Tips competency={competency} />} />
                        <Route
                            path={`${path}/Jobs`}
                            render={() => <JobAssignments competency={competency} />} />
                        <Route
                            path={`${path}/Reflect`}
                            render={() => <TimeToReflect competency={competency} />} />
                        <Route
                            path={`${path}/LearnMore`}
                            render={() => <LearnMore competency={competency} />} />
                        <Redirect to={`${path}/Scales`} />
                    </Switch>
                </div>
            </div>
        </div>
    </div>
}

export default withRouter(CompetencyItem);

const Scales = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon pr-md-3'><FontAwesomeIcon icon='plus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.SKILLED')}</span></p>
            {printList(competency.Skilled)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon pl-md-3'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{localizationStore.getString('Skills.LESS')}</span></p>
            {printList(competency.LessSkilled)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon pr-md-3'><FontAwesomeIcon icon='gem' /><span className='pl-2'>{localizationStore.getString('Skills.TALENTED')}</span></p>
            {printList(competency.Talented)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon pl-md-3'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{localizationStore.getString('Skills.OVERUSED')}</span></p>
            {printList(competency.OverusedSkill)}
        </div>
    </div>
}

const Overview = ({ competency }) => {

    return <div className='row animate-bottom'>
        <div className='col'>
            <div className='row'>
                <div className='col col-md-6 h5 text-uppercase font-weight-bold' style={{ color: 'rgba(66,70,157,.65)' }}>{competency.Description}</div>
            </div>
            <ContextWithQuote context={competency.Context} quote={competency.Quotes[0]} />
            <div><FontAwesomeIcon className='item-skill-icon' icon='lightbulb' /><span className='pl-2'>{competency.Positioning}</span></div>
        </div>
    </div>
}

const PossibleCauses = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12 col-md-6'>
            <div className='mr-md-3'>
                <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(29,118,144)' }}>{localizationStore.getString('Library.Item.Competency.PossibleCauses')}</h5>
                <p>{safeReplace(localizationStore.getString('Library.Item.Competency.PossibleCauses.Description'), competency.Name)}</p>
                {printList(competency.Causes)}
            </div>
        </div>
        <div className='col-12 col-md-6'>
            <div className='rounded ml-md-3 px-3 py-4 p-md-4 h-100 w-100 text-justify' style={{ background: '#d3e5ea' }}>
                <h5 className='font-weight-bold'><FontAwesomeIcon className='mr-2' icon='question-circle' />{competency.CaseStudy.Type}</h5>
                <p>{competency.CaseStudy.Case}</p>
            </div>
        </div>
    </div>
}

const Tips = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(0,126,58)' }}>{safeReplace(localizationStore.getString('Library.Item.Competency.Tips'), competency.Name)}</h5>
        </div>
        {competency.Tips.map((tip, i) => {
            return <CollapsableTip index={i} phrase={tip.Phrase} content={tip.TipContent} key={i}>
                {tip.WantToLearnMore.length > 0 &&
                    <div className='border p-2 my-2' style={{ background: 'rgba(213,232,224,1)' }}>
                        <h6 className='font-weight-bold' style={{ color: 'rgb(0,126,58)' }}><FontAwesomeIcon className='mr-2' icon='user-graduate' />{localizationStore.getString('Library.Item.Tip.WantToLearnMore')}</h6>
                        {tip.WantToLearnMore.map((learnMore, i) => <p key={i}>{learnMore}</p>)}
                    </div>
                }
            </CollapsableTip>
        })
        }
    </div>
}

const JobAssignments = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgba(127, 127, 127, 1)' }}>{localizationStore.getString('Library.Item.JobAssignments')}</h5>
        </div>
        <div className='col-12 rounded column-split py-4' style={{ background: 'rgba(230,230,230,0.6)' }}>
            {printList(competency.JobAssignments)}
        </div>
    </div>
}

const TimeToReflect = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(29,118,144)' }}>{localizationStore.getString('Library.Item.TimeToReflect')}</h5>
        </div>
        <div className='col-12 col-md-6 pr-md-2'>
            {competency.TimeToReflect.map((timeToReflect, i) => {
                return <div className='py-1' key={i}>
                    <p className='font-italic'>{timeToReflect.Statement}</p>
                    <p className='pl-3'>{timeToReflect.Suggestion}</p>
                </div>
            })
            }
        </div>
        <div className='col-12 col-md-6 pl-md-2'>
            <Quote quote={competency.Quotes[1]} background='rgb(211, 229, 234)' />
        </div>
    </div>
}


const targetBlankDecorator = (decoratedHref: string, decoratedText: string, key: number) => {
    return (
        <a className='linkify-link' target='_blank' href={decoratedHref} key={key}>
            {decoratedText}
        </a>
    );
}

const LearnMore = ({ competency }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <ReactLinkify componentDecorator={targetBlankDecorator}>
        <div className='row animate-bottom'>
            <div className='col-12'>
                <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(0,126,58)' }}>{safeReplace(localizationStore.getString('Library.Item.LearnMore'), competency.Name)}</h5>
            </div>
            {competency.LearnMore.map((learnMore, i) => {
                return <div className='col-12 py-1' key={i}>
                    <p>{learnMore}</p>
                </div>
            })
            }
            <div className='col-12 pt-3'>
                <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(0,126,58)' }}>{localizationStore.getString('Library.Item.DeepDive')}</h5>
            </div>
            <div className='col-12 column-split rounded p-3' style={{ background: '#d5e8e0' }}>
                {competency.DeepDiveResources.map((resource, i) => <p className='py-1' key={i}>{resource}</p>)}
            </div>
            <div className='col-12 pt-3'>
                <p className='card-text font-weight-bold' style={{ color: 'rgb(0,126,58)' }}><FontAwesomeIcon icon='cloud-download-alt' /><span className='pl-2'>{localizationStore.getString('Library.Item.MoreHelp.Title')}</span></p>
                <p>{localizationStore.getString('Library.Item.MoreHelp.Content')}</p>
            </div>
        </div>
    </ReactLinkify>
}


