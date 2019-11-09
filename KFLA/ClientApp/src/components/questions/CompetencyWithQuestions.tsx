import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency'
import { Question } from '../../models/Question';
import { useStore } from '../../stores/hook';

const getQuestionsClass = (question: Question) => {
    let classes = 'row mb-2';
    if (!question.IsSelected)
        classes += ' react-no-print';
    return classes;
}

export const CompetencyWithQuestions: React.FC<{ competency: Competency }> = observer(props => {
    const { localizationStore } = useStore(stores => stores);
    const { competency } = props;

    return <div className='card radius-0 mb-2'>
        <div className='card-body'>
            <h4 className='card-title pb-1 border-bottom border-dark'>
                <span>{competency.ID}.</span>
                <span className='pl-3 color-dark'>{competency.Name}</span>
            </h4>
            <div className='mr-3'>
                <p className='card-text font-weight-bold'>{competency.Description}</p>
                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='question-circle' className='color-dark' /><span className='pl-2'>{localizationStore.getString('QuestionsResult.Questions')}</span></p>
                {
                    competency.Questions.map((question, i) => {
                        return <div className={getQuestionsClass(question)} key={i}>
                            <div className='col-1 align-self-center react-no-print'>
                                <label className='check-container'>
                                    <input type='checkbox' checked={question.IsSelected} onChange={(e) => question.toggleSelection()} />
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='col'>
                                <span className='card-text' style={{ fontSize: '80%' }}>{i + 1}. {question.QuestionContent}</span>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className='react-print'>
                <p className='card-text font-weight-bold'>{localizationStore.getString('QuestionsResult.Notes')}:</p>
                <hr className='dotted' />
                <hr className='dotted' />
            </div>
        </div>
    </div>
})