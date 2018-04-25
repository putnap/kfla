import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Competency } from '../../models/Competency';
import { EmptyListWarning } from '../EmptyListWarning';
import { CompetencyList } from './CompetencyList';
import { NavMenu } from '../NavMenu';

interface CompetenciesContainerState {
    loadingData: boolean,
    competencies: Competency[]
}

export class CompetenciesContainer extends React.Component<RouteComponentProps<{}>, CompetenciesContainerState> {

    constructor() {
        super();

        this.state = {
            loadingData: true,
            competencies: []
        };
    }

    public componentDidMount() {
        fetch('api/Competencies')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                setTimeout(() => { 
                    this.setState((state, props) => {
                        state.competencies = JSON.parse(data);
                        state.loadingData = false;
                    });
                }, 1000)
            });
    }

    public render() {
        const hasCompetencies = this.state.competencies.length > 0;

        return <section>
            <div className='row'>
                <NavMenu />
            </div>
            <div className='row mx-auto contentContainer'>
                {
                    this.state.loadingData ?
                        <p className='text-center'>Loading data...</p> :
                        hasCompetencies ? <CompetencyList competencies={this.state.competencies} /> : <EmptyListWarning />
                }
            </div>
        </section>;
    }
}