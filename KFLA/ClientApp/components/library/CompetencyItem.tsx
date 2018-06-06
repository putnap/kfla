import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { render } from 'react-dom';
import { Skills } from '../../@types/types';

interface CompetencyItemProps {
    competency: Competency;
}

@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    splitStringToList(text: string) {
        return <ul>
            {text.split('\n').map(i => {
                if (i)
                    return <li>{i}</li>;
            })}
        </ul>
    }

    render() {
        return <div>
            <div className='row competency-as-button' data-toggle='modal' data-target={'#competency' + this.props.competency.ID} style={{ cursor: 'pointer' }}>
                <div className='col-1 p-0 text-right'>
                    <span>{this.props.competency.ID}.</span>
                </div>
                <div className='col'>
                    <div className='font-weight-bold'>{this.props.competency.Name}</div>
                    <div>{this.props.competency.Description}</div>
                </div>
            </div>
            <div className='modal fade' id={'competency' + this.props.competency.ID} tabIndex={-1} role='dialog' aria-labelledby={'competency' + this.props.competency.ID + 'label'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4 className='modal-title' id={'competency' + this.props.competency.ID + 'label'}>
                                <span>{this.props.competency.ID}.</span>
                                <span className='pl-3 color-dark'>{this.props.competency.Name}</span>
                            </h4>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='mr-3'>
                                <p className='card-text font-weight-bold'>{this.props.competency.Description}</p>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='plus-circle' /><span className='pl-2'>{Skills.SKILLED}</span></p>
                                <p className='card-text font-weight-bold' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.Skilled)}</p>
                                <div className='row'>
                                    <div className='col'>
                                        <p className='card-text font-weight-bold'><FontAwesomeIcon icon='minus-circle' /><span className='pl-2'>{Skills.LESS}</span></p>
                                        <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.LessSkilled)}</p>
                                    </div>
                                    <div className='col'>
                                        <p className='card-text font-weight-bold'><FontAwesomeIcon icon='gem' /><span className='pl-2'>{Skills.TALENTED}</span></p>
                                        <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.Talented)}</p>
                                    </div>
                                </div>
                                <p className='card-text font-weight-bold'><FontAwesomeIcon icon='exclamation-circle' /><span className='pl-2'>{Skills.OVERUSED}</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.competency.OverusedSkill)}</p>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <span className='w-100' style={{ fontSize: '10px' }}>Korn Ferry Leadership Architect™ Global Competency Framework Sort Cards</span>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}


