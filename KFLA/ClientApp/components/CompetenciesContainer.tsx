import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Competency } from '../models/Competency';

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
                this.setState((state, props) => {
                    state.competencies = JSON.parse(data);
                    state.loadingData = false;
                });
            });
    }

    public render() {
        const hasCompetencies = this.state.competencies.length > 0;

        return (
            this.state.loadingData ?
                <p className='text-center'>Loading data...</p> :
                hasCompetencies ? <p>Competencies list</p> : <p>No data</p> 
        )
    }
}