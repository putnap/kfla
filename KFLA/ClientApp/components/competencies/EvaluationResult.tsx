import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Competency } from '../../models/Competency';
import { Evaluation } from '../../models/Evaluation';
import { Factor } from '../../models/Factor';
import { FactorList } from '../FactorList';
import { Loader } from '../Loader';

interface EvaluationResultProps extends RouteComponentProps<{}> {
    competencyStore?: CompetencyStore
}

@inject("competencyStore")
@observer
export class EvaluationResult extends React.Component<EvaluationResultProps, {}> {

    constructor(props: EvaluationResultProps) {
        super(props);

        const renderCall = this.renderCompetency;
        window.matchMedia('print').addListener(() => {
            if (window.matchMedia('print').matches) {
                const store = this.props.competencyStore;
                const factors = store.groupCompetencies(store.evaluatedCompetencies);
                ReactDOM.render(<section>
                    <FactorList factors={factors} renderCompetency={renderCall} animate={false} />
                </section>, document.getElementById('react-print'));
            }
            else {
                var element = document.getElementById('react-print');
                if (element != null)
                    ReactDOM.unmountComponentAtNode(element);
            }
        });
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
        const factors = store.groupCompetencies(store.evaluatedCompetencies);
        return <section>
            <div className='row background-light'>
                <NavMenu />
            </div>
            <div className='row background-light contentContainer height-100'>
                <div className='col'>
                    {
                        store.evaluationReady ?
                            <FactorList factors={factors} renderCompetency={this.renderCompetency} animate={true} /> :
                            <Loader text='No competencies evaluated. Redirrecting...' />
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