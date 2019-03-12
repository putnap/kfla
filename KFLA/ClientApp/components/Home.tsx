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
        this.props.localizationStore.setTitle('Home.Title');
    }

    public render() {
        const width = window.innerWidth;
        return <div role='navigation'>
            <div className='fixed-top m-3'>
                <img className='w-25' src={require('../logos/logo-korn-ferry.png')} alt='Korn Ferry' />
            </div>
            {
                width > 992 ?
                    <div className='row height-100'>
                        <div className='col-4 background-lib'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.LIBRARY')}</NavLink>
                            </div>
                        </div>
                        <div className='col-4 background-light'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold mx-auto' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.COMPETENCIES')}</NavLink>
                            </div>
                        </div>
                        <div className='col-4 background-dark'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.QUESTIONS')}</NavLink>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='row height-100'>
                        <div className='col-12 background-lib'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.LIBRARY')}</NavLink>
                            </div>
                        </div>
                        <div className='col-12 background-light'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold mx-auto' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.COMPETENCIES')}</NavLink>
                            </div>
                        </div>
                        <div className='col-12 background-dark'>
                            <div className='h-100 text-center' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '300%' }}>{this.props.localizationStore.getString('PageTitles.QUESTIONS')}</NavLink>
                            </div>
                        </div>
                    </div>
            }
            <div className='fixed-bottom text-right m-3 font-weight-bold text-white'>
                <img src={require('../logos/Logo-White-Contrast.png')} alt='Littlefuse' style={{ width: '10%' }} />
                <br />
                <span>{this.props.localizationStore.getString('Home.Internal')}</span>
            </div>
        </div>;
    }
}
