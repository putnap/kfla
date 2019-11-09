import * as React from 'react';
import { RouteComponentProps, Route, Switch, Redirect, withRouter } from 'react-router';
import { safeReplace, ContextWithQuote, Quote, printList, CollapsableTip, DropRightMenuItemProps, DropRightMenu } from './shared';
import { Stopper } from '../../../models/Stopper';
import { useStore } from '../../../stores/hook';

interface StopperItemProps extends RouteComponentProps<{}> {
    stopper: Stopper;
}

const StopperItem: React.FC<StopperItemProps> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { stopper, match } = props;

    const menuItems: DropRightMenuItemProps[] = [
        { link: 'Scales', icon: 'balance-scale', linkText: localizationStore.getString('Library.Items.Links.Scales') },
        { link: 'Overview', icon: 'info', linkText: localizationStore.getString('Library.Items.Links.Overview') },
        { link: 'PossibleCauses', icon: 'route', linkText: localizationStore.getString('Library.Items.Links.PossibleCauses') },
        { link: 'Tips', icon: 'brain', linkText: localizationStore.getString("Library.Items.Links.Tips") },
        { link: 'Jobs', icon: 'briefcase', linkText: localizationStore.getString('Library.Items.Links.Jobs') },
        { link: 'LearningResources', icon: ['fab', 'leanpub'], linkText: localizationStore.getString('Library.Items.Links.LearningResources') },
    ];

    return <div>
        <div className='row'>
            <div className='col d-flex flex-column flex-md-row'>
                <div className='order-1 flex-grow-1'><h2 className='font-weight-bold mx-3 mb-2'>{stopper.ID}. {stopper.Name}</h2></div>
                <div className='order-0 order-md-2 mx-3 mb-2 small'><b>{localizationStore.getString('Cluster')} {stopper.Cluster.ID}:</b> {stopper.Cluster.Name}</div>
            </div>
        </div>
        <div className='row'>
            <div className='col d-flex'>
                <DropRightMenu menuItems={menuItems} />
                <div className='my-3 mx-3 mx-md-5' style={{ width: '100%' }}>
                    <Switch>
                        <Route
                            path={`${match.path}/Scales`}
                            component={() => <Scales stopper={stopper} />} />
                        <Route
                            path={`${match.path}/Overview`}
                            component={() => <Overview stopper={stopper} />} />
                        <Route
                            path={`${match.path}/PossibleCauses`}
                            component={() => <PossibleCauses stopper={stopper} />} />
                        <Route
                            path={`${match.path}/Tips`}
                            component={() => <Tips stopper={stopper} />} />
                        <Route
                            path={`${match.path}/Jobs`}
                            component={() => <JobAssignments stopper={stopper} />} />
                        <Route
                            path={`${match.path}/LearningResources`}
                            component={() => <LearningResources stopper={stopper} />} />
                        <Redirect to={`${match.path}/Scales`} />
                    </Switch>
                </div>
            </div>
        </div>
    </div>
}

export default withRouter(StopperItem);

const Overview = ({ stopper }) => {

    return <div className='row animate-bottom'>
        <div className='col'>
            <ContextWithQuote context={stopper.Context} quote={stopper.Quotes[0]} />
        </div>
    </div>
}

const Scales = ({ stopper }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon'><span className='pl-2'>{localizationStore.getString('StopperItem.Problem')}</span></p>
            {printList(stopper.Problem)}
        </div>
        <div className='col-sm-12 col-md-6'>
            <p className='card-text font-weight-bold item-skill-icon'><span className='pl-2'>{localizationStore.getString('StopperItem.NotAProblem')}</span></p>
            {printList(stopper.NotProblem)}
        </div>
    </div>
}

const PossibleCauses = ({ stopper }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(29,118,144)' }}>{localizationStore.getString('Library.Item.Stopper.PossibleCauses')}</h5>
            {printList(stopper.Causes)}
        </div>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(29,118,144)' }}>{localizationStore.getString('Library.Item.Stopper.OtherCauses')}</h5>
            <p>{safeReplace(localizationStore.getString('Library.Item.Stopper.OtherCauses.Description'), stopper.Name)}</p>
        </div>
        <div className='col-12'>
            <h6>{localizationStore.getString('Library.Item.Stopper.OtherCauses.BeingLessSkilled')}</h6>
            <ul className='list-unstyled pl-3'>
                {stopper.OtherCausesBeingLessSkilled.map(i => {
                    return <li key={i}><p className='class-text'>{i}</p></li>;
                })}
            </ul>
        </div>
        <div className='col-12'>
            <h6>{localizationStore.getString('Library.Item.Stopper.OtherCauses.Overusing')}</h6>
            <ul className='list-unstyled pl-3'>
                {stopper.OtherCausesOverusing.map(i => {
                    return <li key={i}><p className='class-text'>{i}</p></li>;
                })}
            </ul>
        </div>
    </div>
}


const getTipsKey = (stopper: Stopper) => {
    const beingTipsIds = [101, 102, 107];
    if (beingTipsIds.indexOf(stopper.ID) > -1)
        return 'Library.Item.Stopper.TipsBeing';

    return 'Library.Item.Stopper.Tips';
}

const Tips = ({ stopper }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(0,126,58)' }}>{safeReplace(localizationStore.getString(getTipsKey(stopper)), stopper.Name)}</h5>
        </div>
        {stopper.Tips.map((tip, i) => {
            return <CollapsableTip index={i} phrase={tip.Phrase} content={tip.TipContent} key={i} />
        })
        }
    </div>
}

const JobAssignments = ({ stopper }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgba(127, 127, 127, 1)' }}>{localizationStore.getString('Library.Item.JobAssignments')}</h5>
        </div>
        <div className='col-12 col-md-6 pr-md-2 mb-3 mb-md-0'>
            <div className='rounded py-4 pr-3' style={{ background: 'rgba(230,230,230,0.6)' }}>
                {printList(stopper.JobAssignments)}
            </div>
        </div>
        <div className='col-12 col-md-6 pl-md-2'>
            <Quote quote={stopper.Quotes[1]} />
        </div>
    </div>
}

const LearningResources = ({ stopper }) => {
    const localizationStore = useStore(stores => stores.localizationStore);

    return <div className='row animate-bottom'>
        <div className='col-12'>
            <h5 className='text-uppercase font-weight-bold' style={{ color: 'rgb(0,126,58)' }}>{localizationStore.getString('Library.Item.LearningResources')}</h5>
        </div>
        {stopper.LearningResources.map((resource, i) => {
            return <div className='col-12 py-1' key={i}>
                <p>{resource}</p>
            </div>
        })
        }
    </div>
}


