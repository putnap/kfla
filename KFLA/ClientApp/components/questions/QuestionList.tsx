import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Competency } from '../../models/Competency';
import { Button } from '../Button';
import { QuestionsPrintTemplate } from './QuestionsPrintTemplate';

interface QuestionListProps {
    competencies: Competency[]
}

export class QuestionList extends React.Component<QuestionListProps, any> {

    constructor(props: QuestionListProps) {
        super(props);

        window.matchMedia('print').addListener(() => {
            if (window.matchMedia('print').matches) {
                let selectedCompetencies = this.props.competencies.filter(competency => { return competency.IsSelected; });
                ReactDOM.render(<QuestionsPrintTemplate competencies={selectedCompetencies} />, document.getElementById('print-mount'));
            }
            else {
                var element = document.getElementById('print-mount');
                if (element != null)
                    ReactDOM.unmountComponentAtNode(element);
            }
        });
    }

    competencySelected(competency: Competency) {
        competency.IsSelected = !competency.IsSelected;
        console.log(competency.Name + ' ' + competency.IsSelected);
    }

    print() {
        window.print();
    }

    render() {
        return (
            <section className='container'>
                <div className='col'>
                    {
                        this.props.competencies.map(competency => {
                            return <div className='row border border-dark' key={competency.Name}>
                                <div className='col'>
                                    <div className='row p-3'>
                                        <label>
                                            <input onChange={(e) => this.competencySelected(competency)} type='checkbox' defaultChecked={competency.IsSelected} />
                                            <span className='pl-2'>{competency.Name}</span>
                                        </label>
                                    </div>
                                    <div className='row p-3'>
                                        <span>{competency.Description}</span>
                                    </div>
                                    <div className='row border-top border-dark'>
                                        <div className='col p-3'>
                                            {
                                                competency.Questions.map((question, qi) => {
                                                    return <div className='row' key={qi}>
                                                            <div className='col p-3'>
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
                {/*<div className='float-left'>
                    <button type='button' className='btn btn-primary btn-sm' onClick={(e) => this.print()}>
                        Print
                    </button>
                </div>
                */}
            </section>
        )
    }

}