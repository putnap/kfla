import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { PageTitles } from '../@types/types';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    componentDidMount() {
        document.title = 'Korn Ferry Leadership Architect™';
    }

    public render() {
        return <div className='row vertical-center' role='navigation'>
            <div className='col background-lib'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold'>{PageTitles.LIBRARY}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-light'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold'>{PageTitles.COMPETENCIES}</NavLink>
                    </div>
                </div>
            </div>
            <div className='col background-dark'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link font-weight-bold'>{PageTitles.QUESTIONS}</NavLink>
                    </div>
                </div>
            </div>
        </div>;
    }
}
    