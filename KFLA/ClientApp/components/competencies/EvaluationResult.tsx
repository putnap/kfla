import * as React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Competency } from '../../models/Competency';
import { observer, inject } from 'mobx-react';
import { Evaluation } from '../../models/Evaluation';
import { EvaluationResultID } from '../../@types/types';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';

interface EvaluationResultProps extends RouteComponentProps<EvaluationResultID> {
    competencyStore?: CompetencyStore
}


export class EvaluationResult extends React.Component<EvaluationResultProps, {}> {

    componentDidMount() {
        if (this.props.match.params.evaluationResult) {
            //this.props.competencyStore.
        }
        console.log(this.props.match.params.evaluationResult);
    }

    public render() {
        const store = this.props.competencyStore;
        return <section>
            <div className='row'>
                <NavMenu />
            </div>
            <div className='row contentContainer'>
                <div className='col'>
                    {
                    //    store!.isLoading ? <Loader /> : <CompetencyList competencyStore={store!} />
                    }
                </div>
            </div>
            <div className='btn-floating-container'>
                <Link to='/competencies' className='btn btn-secondary rounded-circle'> New </Link>
            </div>
        </section>;
    }
}