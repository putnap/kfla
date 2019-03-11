﻿import * as React from 'react';
import { Stopper } from '../../models/Stopper';
import { observer, inject } from 'mobx-react';
import { LocalizationStore } from '../../stores/LocalizationStore';

interface StopperItemProps {
    stopper: Stopper;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class StopperItem extends React.Component<StopperItemProps, {}> {

    splitStringToList(text: string) {
        return <ul>
            {text.split("\n").map(i => {
                if (i)
                    return <li><p>{i}</p></li>;
            })}
        </ul>
    }

    render() {
        return <div>
            <div className='row competency-as-button p-1' data-toggle='modal' data-target={'#stopper' + this.props.stopper.ID} style={{ cursor: 'pointer' }}>
                <div className='col-1 p-0 text-right'>
                    <span>{this.props.stopper.ID}.</span>
                </div>
                <div className='col'>
                    <div className='font-weight-bold'>{this.props.stopper.Name}</div>
                </div>
            </div>
            <div className='modal fade' id={'stopper' + this.props.stopper.ID} tabIndex={-1} role='dialog' aria-labelledby={'stopper' + this.props.stopper.ID + 'label'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4 className='modal-title' id={'stopper' + this.props.stopper.ID + 'label'}>
                                <span>{this.props.stopper.ID}.</span>
                                <span className='pl-3 color-dark'>{this.props.stopper.Name}</span>
                            </h4>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='mr-3'>
                                <p className='card-text font-weight-bold'><span className='pl-2'>{this.props.localizationStore.getString('StopperItem.Problem')}</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.stopper.Problem)}</p>
                                <p className='card-text font-weight-bold'><span className='pl-2'>{this.props.localizationStore.getString('StopperItem.NotAProblem')}</span></p>
                                <p className='card-text' style={{ fontSize: '80%' }}>{this.splitStringToList(this.props.stopper.NotProblem)}</p>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <span className='w-100' style={{ fontSize: '10px' }}>{this.props.localizationStore.getString('RightsReserved')}</span>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>{this.props.localizationStore.getString('Buttons.Close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}


