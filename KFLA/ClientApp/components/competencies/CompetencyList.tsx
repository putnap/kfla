import * as React from 'react';
import { Competency } from 'ClientApp/models/Competency';

interface CompetencyListProps {
    competencies: Competency[]
}

export class CompetencyList extends React.Component<CompetencyListProps, any> {

    render() {
        return (
            <section className='row'>
                <div className='col'>
                    {
                        this.props.competencies.map(competency => {
                            return <div className='row border border-dark' key={competency.ID} >
                                <div className='col'>
                                    <div className='row p-3'>
                                        <span>{competency.ID}</span>
                                        <span className='pl-3'>{competency.Name}</span>
                                    </div>
                                    <div className='row p-3'>
                                        <span>{competency.Description}</span>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </section>
        )
    }

}