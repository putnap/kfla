import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { Factor } from '../../models/Factor';
import { EvaluationPrintTemplate } from './EvaluationPrintTemplate';
import { FactorList } from '../FactorList';

interface EvaluationResultProps extends RouteComponentProps<{}> {
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
                ReactDOM.render(<EvaluationPrintTemplate factors={this.state.factors} renderCompetency={this.renderCompetency} />, document.getElementById('react-print'));
            }
            else {
                var element = document.getElementById('react-print');
                if (element != null)
                    ReactDOM.unmountComponentAtNode(element);
            }
        });

        this.state = {
            factors: this.props.competencyStore.groupCompetencies(this.props.competencyStore.evaluatedCompetencies)
        };
    }

    printPage() {
        window.print();
    }

    resetEvaluation() {
        this.props.competencyStore.resetEvaluation();
        this.props.history.push("/competencies");
    }

    renderCompetency(competency: Competency): JSX.Element {
        return <div className='row' style={{ color: competency.Evaluation.Color }} >
            <div className='col-1 text-right'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <div className='font-weight-bold'>{competency.Name}</div>
                <div>{competency.Description}</div>
            </div>
        </div>;
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='row background-light'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100'>
                <div className='col'>
                    <FactorList factors={this.state.factors} renderCompetency={this.renderCompetency} />
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