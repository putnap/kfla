import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PageTitles } from '../@types/types';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='navbar navbar-expand-md top-navbar' role='navigation'>
            <NavLink to={'/'} activeClassName='active' className='nav-link'>
                <span className='visible-xs navbar-brand'>Home</span>
            </NavLink>
            <div className='navbar-nav'>
                <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link'>
                    {PageTitles.LIBRARY}
                </NavLink>
                <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link'>
                    {PageTitles.COMPETENCIES}
                </NavLink>
                <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link'>
                    {PageTitles.QUESTIONS}
                </NavLink>
            </div>
        </div>;
    }
}
