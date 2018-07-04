import * as React from 'react';
import * as jQuery from 'jquery';

export interface VideoModalProps {
    id: string;
    url: string;
}

export interface VideoModalState {
    playing: boolean;
}

export class VideoModal extends React.Component<VideoModalProps, VideoModalState> {


    constructor(props: VideoModalProps) {
        super(props);
        this.state = { playing: false };
    }

    componentDidMount() {
        jQuery('#' + this.props.id).on('hidden.bs.modal', () => {
            this.setState({ playing: false });
        })
    }

    videoEnded() {
        jQuery('#' + this.props.id).modal('hide');
    }

    videoStarted() {
        this.setState({ playing: true });
    }

    public render() {
        return <div className='modal fade' id={this.props.id} tabIndex={-1} role='dialog' aria-labelledby={this.props.id + 'label'} aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content' style={{ width: 'auto' }}>
                    <div className='modal-body'>
                    </div>
                    <div className='modal-footer'>
                        <span className='w-100' style={{ fontSize: '10px' }}>© Korn Ferry 2014-2015. All rights reserved.</span>
                        <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}
