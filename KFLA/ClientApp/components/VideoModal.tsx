import * as React from 'react';
import * as jQuery from 'jquery';

export interface VideoModalProps {
    id: string;
    url: string;
}

export class VideoModal extends React.Component<VideoModalProps, {}> {
    private player: HTMLVideoElement;

    componentDidMount() {
        jQuery('#' + this.props.id).on('hidden.bs.modal', () => {
            this.player.pause();
        });
        //jQuery('#' + this.props.id).on('shown.bs.modal', () => {
        //    if (this.player.currentTime > 0)
        //        setTimeout(() => {
        //            this.player.play();
        //        }, 300);
        //})
    }

    componentWillUnmount() {
        jQuery('#' + this.props.id).modal('hide');
    }

    public render() {
        return <div className='modal fade' id={this.props.id} tabIndex={-1} role='dialog' aria-labelledby={this.props.id + 'label'} aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content' style={{ width: 'auto' }}>
                    <div className='modal-body'>
                        <video ref={(ref) => this.player = ref} id='videoPlayer' width='640' height='360' controls>
                            <source src={this.props.url} type='video/mp4' />
                        </video>
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
