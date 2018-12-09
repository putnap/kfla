import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Competency } from '../../models/Competency';
import { FactorList } from '../FactorList';
import { Loader } from '../Loader';
import { LandscapeOrientation } from '../orientations';
import { VideoModal } from '../VideoModal';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface EvaluationResultProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
    localizationStore?: LocalizationStore
}

@inject("competencyStore", "localizationStore")
@observer
export class EvaluationResult extends React.Component<EvaluationResultProps, {}> {
    
    constructor(props: EvaluationResultProps) {
        super(props);

        this.renderCompetency = this.renderCompetency.bind(this);
    }

    componentDidMount() {
        const store = this.props.competencyStore;
        if (!store.evaluationReady) {
            store.resetEvaluation();
            setTimeout(() => {
                this.props.history.push("/competencies");
            }, 2000)
        }
    }

    printPage() {
        window.print();
    }

    showInfo() {
        jQuery('#competenciesVideo').modal();
    }

    resetEvaluation() {
        if (window.confirm(this.props.localizationStore.getString('Evaluation.Reset'))) {
            this.props.competencyStore.resetEvaluation();
            this.props.history.push("/competencies");
        }
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <div className='row competencyItem' >
            <div className='col-1 text-right p-0'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <FontAwesomeIcon icon={competency.Evaluation.Icon} style={{ color: competency.Evaluation.Color }} />
                <span className='ml-2 font-weight-bold' style={{ color: competency.Evaluation.Color }}>{competency.Name}</span>
                <div>{competency.Description}</div>
            </div>
        </div>;
    }

    public render() {
        const store = this.props.competencyStore;
        const factors = store.groupCompetencies(store.evaluatedCompetencies);
        return <section>
            <div className='row background-light react-no-print'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100 px-5'>
                <LandscapeOrientation />
                <div className='col evaluations'>
                    {
                        store.evaluationReady ?
                            <div style={{ position: 'relative' }}>
                                <FactorList factors={factors} renderCompetency={this.renderCompetency} animate={true} />
                                <div style={{ position: 'absolute', bottom: '25px' }}>
                                    <span className='font-weight-bold'>{this.props.localizationStore.getString('EvaluationResult.Legend')}:</span>
                                    {
                                        store.evaluations.map(evaluation => {
                                            return <div className='align-self-center my-2' style={{ color: evaluation.Color }} data-toggle='tooltip' title={evaluation.Tooltip}>
                                                <FontAwesomeIcon icon={evaluation.Icon} className='mx-2' />
                                                <span className='font-weight-bold text-uppercase'>{evaluation.Name}</span>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <Loader text={this.props.localizationStore.getString('EvaluationResult.Empty')} />
                    }
                </div>
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Info')}>
                        <FontAwesomeIcon icon='info' />
                    </button>
                    <button onClick={(e) => this.printPage()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Print')}>
                        <FontAwesomeIcon icon='print' />
                    </button>
                    <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle' title={this.props.localizationStore.getString('Buttons.Reset')}>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
                <VideoModal id='competenciesVideo' videoId='2yT0gqnKb-A' />
            </div>
        </section>;
    }
}