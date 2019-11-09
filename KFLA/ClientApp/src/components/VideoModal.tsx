import * as React from 'react';
import * as jQuery from 'jquery';
import YouTube from 'react-youtube';
import { useStore } from '../stores/hook';

export interface VideoModalProps {
    id: string;
    videoId: string;
}

export const VideoModal: React.FC<VideoModalProps> = props => {

    const localizationStore = useStore(stores => stores.localizationStore);
    const { id, videoId } = props;

    const [player, setPlayer] = React.useState(null);

    React.useEffect(() => {
        if (player) {
            jQuery('#' + id).on('hidden.bs.modal', () => {
                player.pauseVideo();
            });
        }

        return () => jQuery('#' + id).modal('hide');
    }, [player]);

    return <div className='modal fade' id={id} tabIndex={-1} role='dialog' aria-labelledby={id + 'label'} aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
                <div className='modal-body'>
                    <YouTube
                        containerClassName='video-container'
                        className='video-player-frame'
                        videoId={videoId}
                        onReady={e => setPlayer(e.target)}
                    />
                </div>
                <div className='modal-footer'>
                    <span className='w-100' style={{ fontSize: '10px' }}>{localizationStore.getString('RightsReserved')}</span>
                    <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                </div>
            </div>
        </div>
    </div>
}
