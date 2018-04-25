import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Competency } from '../../models/Competency';
import { EmptyListWarning } from '../EmptyListWarning';
import { QuestionList } from './QuestionList';
import { NavMenu } from '../NavMenu';

interface QuestionsContainerState {
    loadingData: boolean,
    competencies: Competency[]
}

export class QuestionsContainer extends React.Component<RouteComponentProps<{}>, QuestionsContainerState> {

    constructor() {
        super();

        this.state = {
            loadingData: true,
            competencies: []
        };
    }

    public componentDidMount() {
        fetch('api/competencies')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                this.setState((state, props) => {
                    state.competencies = JSON.parse(data);
                    state.loadingData = false;
                });
            });
    }

    public render() {
        const hasData = this.state.competencies.length > 0;

        return <section>
            <div className='row'>
                <NavMenu />
            </div>
            <div className='row mx-auto contentContainer'>
            {
                this.state.loadingData ?
                    <p className='text-center'>Loading data...</p> :
                    hasData ? <QuestionList competencies={this.state.competencies} /> : <EmptyListWarning />
            }
            </div>
        </section>;
        
    }
}