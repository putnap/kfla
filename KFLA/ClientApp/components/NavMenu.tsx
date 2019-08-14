import * as React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { LanguageBar } from './LanguageBar';
import { LanguageParam } from '@Types/types';
import { LocalizationStore } from '@Stores/LocalizationStore';

interface NavMenuProps extends RouteComponentProps<LanguageParam> {
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class NavMenu extends React.Component<NavMenuProps, {}> {

    public render() {
        const { localizationStore, match } = this.props;
        const { language } = match.params;
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
                <LanguageBar {...this.props} />
            </div>
        </div>;
    }
}
