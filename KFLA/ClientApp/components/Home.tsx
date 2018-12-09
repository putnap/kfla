import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { LocalizationStore } from '../stores/LocalizationStore';

interface HomeProps extends RouteComponentProps<{}> {
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class Home extends React.Component<HomeProps, {}> {
    componentDidMount() {
        document.title = this.props.localizationStore.getString('Home.Title');
    }

    public render() {
        return <div className='row' role='navigation'>
            <div className='fixed-top m-3'>
                <img className='w-25' src={require('../logos/logo-korn-ferry.png')} alt='Korn Ferry' />
            </div>
            <div className='col background-lib'>
                <div className='height-100 d-table mx-auto'>
                    <div className='d-table-cell align-middle text-center'>
                        <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.LIBRARY')}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-light'>
                <div className='height-100 d-table mx-auto'>
                    <div className='d-table-cell align-middle text-center'>
                        <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold mx-auto' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.COMPETENCIES')}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-dark'>
                <div className='height-100 d-table mx-auto'>
                    <div className='d-table-cell align-middle text-center'>
                        <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.QUESTIONS')}</NavLink>
                    </div>
                </div>
            </div>
            <div className='fixed-bottom text-right m-3 font-weight-bold text-white'>
                <img src={require('../logos/Logo-White-Contrast.png')} alt='Littlefuse' style={{ width: '10%' }} />
                <br />
                <span>{this.props.localizationStore.getString('Home.Internal')}</span>
            </div>
        </div>;
    }
}
    