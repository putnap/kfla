import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { LanguageParam } from '@Types/types';
import { useStore } from '@Stores/hook';
import LanguageBar from './LanguageBar';

const NavMenu: React.FunctionComponent<RouteComponentProps<LanguageParam>> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { match: { params: { language } } } = props;

    return <div className='navbar navbar-expand-md top-navbar' role='navigation'>
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarTogglerDemo01' aria-controls='navbarTogglerDemo01' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarTogglerDemo01'>
            <div className='navbar-nav' style={{ marginRight: 'auto' }}>
                <NavLink to={`/${language}`} activeClassName='active' className='nav-item nav-link'>
                    <span>{localizationStore.getString('PageTitles.HOME')}</span>
                </NavLink>
                <NavLink to={`/${language}/library`} activeClassName='active' className='nav-item nav-link'>
                    {localizationStore.getString('PageTitles.LIBRARY')}
                </NavLink>
                <NavLink to={`/${language}/competencies`} activeClassName='active' className='d-none d-md-block nav-item nav-link'>
                    {localizationStore.getString('PageTitles.COMPETENCIES')}
                </NavLink>
                <NavLink to={`/${language}/questions`} activeClassName='active' className='nav-item nav-link'>
                    {localizationStore.getString('PageTitles.QUESTIONS')}
                </NavLink>
            </div>
            <LanguageBar />
        </div>
    </div>;
}

export default withRouter(NavMenu);

