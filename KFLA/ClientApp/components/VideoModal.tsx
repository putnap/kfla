import * as React from 'react';
import * as jQuery from 'jquery';
import YouTube from 'react-youtube';
import { inject, observer } from 'mobx-react';
import { LocalizationStore } from '../stores/LocalizationStore';

export interface VideoModalProps {
    id: string;
    videoId: string;
    localizationStore?: LocalizationStore;
}

export interface VideoModalState {
    player: any;
}

@inject("localizationStore")
@observer
export class VideoModal extends React.Component<VideoModalProps, VideoModalState> {

    constructor(props: VideoModalProps) {
        super(props);

        this.state = {
            player: null
        }

        this.onReady = this.onReady.bind(this);
    }

    componentDidMount() {
        jQuery('#' + this.props.id).on('hidden.bs.modal', () => {
            this.state.player.pauseVideo();
        });
    }

    componentWillUnmount() {
        jQuery('#' + this.props.id).modal('hide');
    }   

    onReady(event: any) {
        this.setState({
            player: event.target,
        });
    }

    public render() {
        const opts = {
            height: '360',
            width: '640',
            //playerVars: { // https://developers.google.com/youtube/player_parameters
            //    autoplay: 1
            //}
        };

        return <div className='modal fade' id={this.props.id} tabIndex={-1} role='dialog' aria-labelledby={this.props.id + 'label'} aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content' style={{ width: 'auto' }}>
                    <div className='modal-body'>
                        <YouTube
                            videoId={this.props.videoId}
                            opts={opts}
                            onReady={this.onReady}
                        />
                    </div>
                    <div className='modal-footer'>
                        <span className='w-100' style={{ fontSize: '10px' }}>{this.props.localizationStore.getString('RightsReserved')}</span>
                        <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}
