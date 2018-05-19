import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { EvaluationResultID } from '../../@types/types';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { Factor } from '../../models/Factor';
import { EvaluationPrintTemplate } from './EvaluationPrintTemplate';

interface EvaluationResultProps extends RouteComponentProps<EvaluationResultID> {
    competencyStore?: CompetencyStore
}

interface EvaluationResultState {
    factors: Factor[];
}

@inject("competencyStore")
@observer
export class EvaluationResult extends React.Component<EvaluationResultProps, EvaluationResultState> {

    constructor(props: EvaluationResultProps) {
        super(props);

        window.matchMedia('print').addListener(() => {
            if (window.matchMedia('print').matches) {
                ReactDOM.render(<EvaluationPrintTemplate factors={this.state.factors} />, document.getElementById('react-print'));
            }
            else {
                var element = document.getElementById('react-print');
                if (element != null)
                    ReactDOM.unmountComponentAtNode(element);
            }
        });

        const factors: Factor[] = [];
        this.props.competencyStore.evaluatedCompetencies.forEach(competency => {
            let factor = competency.Factor;
            let cluster = competency.Cluster;
            if (factors.filter(f => f.ID == competency.Factor.ID).length == 0)
                factors.push(factor);
            else
                factor = factors.filter(f => f.ID == competency.Factor.ID)[0];

            if (factor.Clusters.filter(c => c.ID == cluster.ID).length == 0)
                factor.Clusters.push(cluster);
            else
                cluster = factor.Clusters.filter(c => c.ID == cluster.ID)[0];

            if (cluster.Competencies.filter(c => c.ID == competency.ID).length == 0)
                cluster.Competencies.push(competency);
        });

        this.state = {
            factors: factors
        };
    }

    componentDidMount() {
        if (this.props.match.params.evaluationResult) {
            //this.props.competencyStore.
        }
        console.log(this.props.match.params.evaluationResult);
    }

    printPage() {
        window.print();
    }

    resetEvaluation() {
        this.props.competencyStore.resetEvaluation();
        this.props.history.push("/competencies");
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='contentContainer background-light height-100'>
                <div className='row'>
                    <NavMenu />
                </div>
                <div className='row m-1'>
                    {
                        this.state.factors.map(factor => {
                            return <div className='col-3 p-1'>
                                <div className='bg-white p-3 h-100'>
                                    <h3 className='color-dark font-weight-bold mb-2'>{factor.Name}</h3>
                                    {
                                        factor.Clusters.map(cluster => {
                                            return <div className='mb-4'>
                                                <h5 className='color-dark font-weight-bold'>{cluster.Name}</h5>
                                                {
                                                    cluster.Competencies.map(competency => {
                                                        return <div className='row' style={{ color: competency.Evaluation.Color }} >
                                                            <div className='col-1 text-right'>
                                                                <span>{competency.ID}.</span>
                                                            </div>
                                                            <div className='col'>
                                                                <div className='font-weight-bold'>{competency.Name}</div>
                                                                <div>{competency.Description}</div>
                                                            </div>
                                                        </div>;
                                                    })
                                                }
                                            </div>;
                                        })
                                    }
                                </div>
                            </div>;
                        })
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <button onClick={(e) => this.printPage()} className='btn rounded-circle background-dark' title='Print'>
                    <i className='fas fa-print'></i>
                </button>
                <button onClick={(e) => this.resetEvaluation()} className='btn rounded-circle background-dark' title='Reset'>
                    <i className='fas fa-redo'></i>
                </button>
            </div>
        </section>;
    }
}