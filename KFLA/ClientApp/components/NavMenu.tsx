import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { LocalizationStore } from '../stores/LocalizationStore';
import { inject, observer } from 'mobx-react';
import { LanguageBar } from './LanguageBar';

interface NavMenuProps {
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class NavMenu extends React.Component<NavMenuProps, {}> {

    constructor(props: NavMenuProps) {
        super(props);

        this.changeLanguage = this.changeLanguage.bind(this);
    }        

    changeLanguage(lang: string) {
        this.props.localizationStore.loadStrings(lang);
    }

    public render() {
        return <div className='navbar navbar-expand-md top-navbar' role='navigation'>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarTogglerDemo01' aria-controls='navbarTogglerDemo01' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarTogglerDemo01'>
                <div className='navbar-nav' style={{ marginRight: 'auto' }}>
                    <NavLink to={'/'} activeClassName='active' className='nav-item nav-link'>
                        <span>{this.props.localizationStore.getString('PageTitles.HOME')}</span>
                    </NavLink>
                    <NavLink to={'/library'} activeClassName='active' className='nav-item nav-link'>
                        {this.props.localizationStore.getString('PageTitles.LIBRARY')}
                    </NavLink>
                    <NavLink to={'/competencies'} activeClassName='active' className='nav-item nav-link'>
                        {this.props.localizationStore.getString('PageTitles.COMPETENCIES')}
                    </NavLink>
                    <NavLink to={'/questions'} activeClassName='active' className='nav-item nav-link'>
                        {this.props.localizationStore.getString('PageTitles.QUESTIONS')}
                    </NavLink>
                </div>
                <LanguageBar />
            </div>
        </div>;
    }
}
