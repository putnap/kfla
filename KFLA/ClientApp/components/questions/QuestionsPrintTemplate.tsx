import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Competency } from 'ClientApp/models/Competency';

interface QuestionsPrintTemplateProps {
    competencies: Competency[]
}

export class QuestionsPrintTemplate extends React.Component<QuestionsPrintTemplateProps, any> {
    render() {

        return (
            <div id='react-print'>
                <section className='row'>
                    <div className='col-md-8 col-md-push-2'>
                        {
                            this.props.competencies.map(competency => {
                                return <div className='row border border-dark' key={competency.Name}>
                                    <div className='col-md-12'>
                                        <div className='row p-3'>
                                            {competency.Name}
                                        </div>
                                        <div className='row p-3'>
                                            <span>{competency.Description}</span>
                                        </div>
                                        <div className='row border-top border-dark'>
                                            <div className='col-md-12 p-3'>
                                                {
                                                    competency.Questions.map((question, qi) => {
                                                        return <div className='row' key={qi}>
                                                            <div className='col-md-12 p-3'>
                                                                <span>{qi + 1}.</span> <span>{question.QuestionContent}</span>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </section>
            </div>
        )
    }
}