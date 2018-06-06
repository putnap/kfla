import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { PageTitles } from '../@types/types';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    componentDidMount() {
        document.title = 'Korn Ferry Leadership Architect�';
    }

    public render() {
        return <div className='row vertical-center' role='navigation'>
            <div className='fixed-top m-3'>
                <img className='w-25' src={require('../logos/Logo-White-Contrast.png')} alt='Littlefuse' />
                <img className='w-25' src={require('../logos/logo-korn-ferry.png')} alt='Korn Ferry' />
            </div>
            <div className='col background-lib'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '200%' }}>{PageTitles.LIBRARY}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-light'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '200%' }}>{PageTitles.COMPETENCIES}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-dark'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold' style={{ fontSize: '200%' }}>{PageTitles.QUESTIONS}</NavLink>
                    </div>
                </div>
            </div>
            <div className='fixed-bottom text-right m-3 font-weight-bold text-white'>
                <img src={require('../logos/Logo-White-Contrast.png')} alt='Littlefuse' style={{ width: '10%' }} />
                <br />
                <span>For internal use only</span>
            </div>
        </div>;
    }
}
    