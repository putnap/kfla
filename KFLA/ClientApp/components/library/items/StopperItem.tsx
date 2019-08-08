import * as React from 'react';
import { Stopper } from '../../../models/Stopper';
import { inject } from 'mobx-react';
import { LocalizationStore } from '../../../stores/LocalizationStore';
import { RouteComponentProps, Route } from 'react-router';
import { generateDroprightButton, safeReplace } from './helpers';
import { printList } from '../../skillPrinter';

interface StopperItemProps extends Partial<RouteComponentProps<{}>> {
    stopper: Stopper;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class StopperItem extends React.Component<StopperItemProps, {}> {

    getTipsKey(stopper: Stopper) {
        const beingTipsIds = [101, 102, 107];
        if (beingTipsIds.indexOf(stopper.ID) > -1)
            return 'Library.Items.Links.Stopper.TipsBeing';

        return 'Library.Items.Links.Stopper.Tips';
    }
    
    render() {
        const { stopper, localizationStore, match } = this.props;

        return <div>
            <div className='row'>
                <div className='col-sm-12 col-md-8'>
                    <h2 className='font-weight-bold mx-3 mb-2'>{stopper.ID}. {stopper.Name}</h2>
                </div>
                <div className='col-sm-12 col-md-4'>
                    <p><b>{localizationStore.getString('Cluster')} {stopper.Cluster.ID}:</b> {stopper.Cluster.Name}</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className='slideout-menu'>
                        {generateDroprightButton(match.url, 'Info', 'info', stopper.Name)}
                        {generateDroprightButton(match.url, 'Skills', 'user', localizationStore.getString('StopperItem.Problem'))}
                        {generateDroprightButton(match.url, 'PossibleCauses', 'sitemap', localizationStore.getString('Library.Items.Links.PossibleCauses'))}
                        {generateDroprightButton(match.url, 'Tips', 'brain', safeReplace(localizationStore.getString(this.getTipsKey(stopper)), stopper.Name))}
                        {generateDroprightButton(match.url, 'Jobs', 'tasks', localizationStore.getString('Library.Items.Links.Jobs'))}
                        {generateDroprightButton(match.url, 'LearningResources', ['fab', 'leanpub'], localizationStore.getString('Library.Items.Links.LearningResources'))}
                    </div>
                </div>
                <div className='col mt-3'>
                    <Route
                        exact
                        path={`${this.props.match.path}`}
                        component={() => <Info stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/Skills`}
                        component={() => <Skills stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/PossibleCauses`}
                        component={() => <PossibleCauses stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/Tips`}
                        component={() => <Tips stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/Jobs`}
                        component={() => <JobAssignments stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/LearningResources`}
                        component={() => <LearningResources stopper={stopper} />} />
                    <Route
                        path={`${this.props.match.path}/Info`}
                        component={() => <Info stopper={stopper} />} />
                </div>
            </div>
        </div>
    }
}

interface StopperDetails {
    stopper: Stopper;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class Info extends React.Component<StopperDetails, {}> {
    render() {
        const stopper = this.props.stopper;
        return <div className='row animate-bottom'>
            <div className='col'>
                <p className='column-split'>{stopper.Context}</p>
                <p className='mx-auto py-2 w-50'>{stopper.Quotes[0]}</p>
            </div>
        </div>
    }
}

@inject("localizationStore")
export class Skills extends React.Component<StopperDetails, {}> {

    render() {
        const { stopper, localizationStore } = this.props;
        return <div className='row animate-bottom'>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><span className='pl-2'>{localizationStore.getString('StopperItem.Problem')}</span></p>
                {printList(stopper.Problem)}
            </div>
            <div className='col-sm-12 col-md-6'>
                <p className='card-text font-weight-bold'><span className='pl-2'>{localizationStore.getString('StopperItem.NotAProblem')}</span></p>
                {printList(stopper.NotProblem)}
            </div>
        </div>
    }
}

@inject("localizationStore")
export class PossibleCauses extends React.Component<StopperDetails, {}> {


    render() {
        const { stopper, localizationStore } = this.props;
        return <div className='row animate-bottom'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.Stopper.PossibleCauses')}</h5>
                {printList(stopper.Causes)}
            </div>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.Stopper.OtherCauses')}</h5>
                <p>{safeReplace(localizationStore.getString('Library.Item.Stopper.OtherCauses.Description'), stopper.Name)}</p>
            </div>
            <div className='col-12'>
                <h6>{localizationStore.getString('Library.Item.Stopper.OtherCauses.BeingLessSkilled')}</h6>
                <ul className='list-unstyled pl-3'>
                    {stopper.OtherCausesBeingLessSkilled.map(i => {
                        return <li key={i}><p className='class-text'  style={{ fontSize: '80%' }}>{i}</p></li>;
                    })}
                </ul>
            </div>
            <div className='col-12'>
                <h6>{localizationStore.getString('Library.Item.Stopper.OtherCauses.Overusing')}</h6>
                <ul className='list-unstyled pl-3'>
                    {stopper.OtherCausesOverusing.map(i => {
                        return <li key={i}><p className='class-text' style={{ fontSize: '80%' }}>{i}</p></li>;
                    })}
                </ul>
            </div>
        </div>
    }
}

@inject("localizationStore")
export class Tips extends React.Component<StopperDetails, {}> {

    getTipsKey(stopper: Stopper) {
        const beingTipsIds = [101, 102, 107];
        if (beingTipsIds.indexOf(stopper.ID) > -1)
            return 'Library.Item.Stopper.TipsBeing';

        return 'Library.Item.Stopper.Tips';
    }

    render() {
        const { stopper, localizationStore } = this.props;
        return <div className='row animate-bottom'>
            <div className='col-12'>
                <h5>{safeReplace(localizationStore.getString(this.getTipsKey(stopper)), stopper.Name)}</h5>
            </div>
            {stopper.Tips.map((tip, i) => {
                return <div className='col-12 py-1' key={i}>
                    <p><b>{i + 1}. {tip.Phrase}</b> {tip.TipContent}</p>
                </div>
            })
            }
        </div>
    }
}

@inject("localizationStore")
export class JobAssignments extends React.Component<StopperDetails, {}> {

    render() {
        const { stopper, localizationStore } = this.props;
        return <div className='row animate-bottom'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.JobAssignments')}</h5>
            </div>
            {printList(stopper.JobAssignments)}
            <div className='col-12 pt-5'>
                <p className='mx-auto py-2 w-50'>{stopper.Quotes[1]}</p>
            </div>
        </div>
    }
}

@inject("localizationStore")
export class LearningResources extends React.Component<StopperDetails, {}> {

    render() {
        const { stopper, localizationStore } = this.props;
        return <div className='row animate-bottom'>
            <div className='col-12'>
                <h5>{localizationStore.getString('Library.Item.LearningResources')}</h5>
            </div>
            {stopper.LearningResources.map((resource, i) => {
                return <div className='col-12 py-1' key={i}>
                    <p>{resource}</p>
                </div>
            })
            }
        </div>
    }
}


