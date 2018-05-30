import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { render } from 'react-dom';
import { faHandHolding } from '@fortawesome/fontawesome-free-solid';

interface CompetencyItemProps {
    competency: Competency;
}

@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    splitStringToList(text: string) {
        return <ul>
            {text.split("\n").map(i => {
                if (i)
                    return <li>{i}</li>;
            })}
        </ul>
    }

    render() {
        return <div>
            <div className='row competency-as-button' data-toggle="modal" data-target="#exampleModal" style={{ cursor: 'pointer' }}>
                <div className='col-1 p-0 text-right'>
                    <span>{this.props.competency.ID}.</span>
                </div>
                <div className='col'>
                    <div className='font-weight-bold'>{this.props.competency.Name}</div>
                    <div>{this.props.competency.Description}</div>
                </div>
            </div>
            <div className='modal fade' id='exampleModal' tabIndex={-1} role='dialog' aria-labelledby='competencyLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4 className='modal-title' id='competencyLabel'>
                                <span>{this.props.competency.ID}.</span>
                                <span className='pl-3 color-dark'>{this.props.competency.Name}</span>
                            </h4>
                            <button type="button" className='close' data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='mr-3'>
                                <p className='card-text font-weight-bold'>{this.props.competency.Description}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>LESS SKILL</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.LessSkilled)}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' /><span className='pl-2'>SKILLED</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.Skilled)}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='beer' /><span className='pl-2'>TALENTED</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.Talented)}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>OVERUSED SKILL</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.OverusedSkill)}</p>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            Korn Ferry Leadership Architect™ Global Competency Framework Sort Cards
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}


