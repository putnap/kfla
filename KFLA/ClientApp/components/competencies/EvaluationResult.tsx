import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { Factor } from '../../models/Factor';
import { FactorList } from '../FactorList';
import { Loader } from '../Loader';
import { LandscapeOrientation } from '../orientations';

interface EvaluationResultProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
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

    resetEvaluation() {
        this.props.competencyStore.resetEvaluation();
        this.props.history.push("/competencies");
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <div className='row competencyItem' style={{ color: competency.Evaluation.Color }} >
            <div className='col-1 text-right p-0'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <FontAwesomeIcon icon={competency.Evaluation.Icon} />
                <span className='ml-2 font-weight-bold'>{competency.Name}</span>
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
                    <h4 className='pb-3 color-dark react-print'>Competency assesment</h4>
                    {
                        store.evaluationReady ?
                            <FactorList factors={factors} renderCompetency={this.renderCompetency} animate={true} /> :
                            <Loader text='No competencies evaluated. Redirrecting...' />
                    }
                </div>
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.printPage()} className='btn rounded-circle' title='Print'>
                        <FontAwesomeIcon icon='print' />
                    </button>
                    <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle' title='Reset'>
                        <FontAwesomeIcon icon='redo' />
                    </button>
                </div>
            </div>
        </section>;
    }
}