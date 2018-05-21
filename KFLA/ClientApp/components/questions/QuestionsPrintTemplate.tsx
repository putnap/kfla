import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Competency } from 'ClientApp/models/Competency';

interface QuestionsPrintTemplateProps {
    competencies: Competency[]
}

export class QuestionsPrintTemplate extends React.Component<QuestionsPrintTemplateProps, any> {
    render() {
        return <section>
            {
                this.props.competencies.map(competency => {
                    return <div className='card radius-0 mb-2'>
                        <div className='card-body'>
                            <h4 className='card-title pb-1 border-bottom border-dark'>
                                <span>{competency.ID}.</span>
                                <span className='pl-3 color-dark'>{competency.Name}</span>
                            </h4>
                            <div className='mr-3'>
                                <p className='card-text font-weight-bold'>{competency.Description}</p>
                                <p className='card-text font-weight-bold'><i className='far fa-question-circle color-dark'></i><span className='pl-2'>QUESTIONS</span></p>
                                {
                                    competency.selectedQuestions.map((question, i) => {
                                        return <div className='row mb-2'>
                                            <div className='col'>
                                                <p className='card-text' style={{ fontSize: '80%' }}>{i + 1}. {question.QuestionContent}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                })
            }
        </section>
    }
}