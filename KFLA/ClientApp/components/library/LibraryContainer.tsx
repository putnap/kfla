import * as React from 'react';
import * as jQuery from 'jquery';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Competency } from '../../models/Competency';
import { NavMenu } from '../NavMenu';
import { CompetencyStore } from '../../stores/CompetencyStore';
import { Loader } from '../Loader';
import { FactorList } from '../FactorList';
import { PageTitles } from '../../@types/types';
import { CompetencyItem } from './CompetencyItem';
import { StoppersList } from './StoppersList';
import { CompetencyList } from './CompetencyList';
import { VideoModal } from '../VideoModal';

@observer
export class LibraryContainer extends React.Component<RouteComponentProps<{}>, {}> {

    componentDidMount() {
        document.title = PageTitles.LIBRARY;
    }

    showInfo() {
        jQuery('#libraryVideo').modal();
    }

    public render() {
        return <div className='row background-lib height-100'>
            <NavMenu />
            <div className='mx-5 w-100' style={{ padding: '65px 15px 0px 15px' }}>
                <CompetencyList />
                <StoppersList />
                <div className='btn-floating-container'>
                    <button onClick={(e) => this.showInfo()} className='btn rounded-circle' title='Info'>
                        <FontAwesomeIcon icon='info' />
                    </button>
                </div>
                <VideoModal id='libraryVideo' url='Videos/library.mp4' />
            </div>
        </div>;
        
    }
}