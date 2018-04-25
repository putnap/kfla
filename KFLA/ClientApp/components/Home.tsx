import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className='row vertical-center' role='navigation'>
            <div className='col bg-dark'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link navigation-link'>Questions</NavLink>
                    </div>
                </div>
            </div>
            <div className='col bg-light'>
                <div className='row vertical-center'>
                    <div className='col text-center'>
                        <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link navigation-link'>Competencies</NavLink>
                    </div>
                </div>
            </div>
        </div>;
    }
}
