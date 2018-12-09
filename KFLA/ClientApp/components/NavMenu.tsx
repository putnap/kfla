import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { LocalizationStore } from '../stores/LocalizationStore';
import { inject, observer } from 'mobx-react';

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
            <NavLink to={'/'} activeClassName='active' className='nav-link'>
                <span className='visible-xs navbar-brand'>Home</span>
            </NavLink>
            <div className='navbar-nav' style={{ marginRight: 'auto' }}>
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
            <div className='lang'>
                <button onClick={(e) => this.changeLanguage("en")} className={this.props.localizationStore.language == 'en' ? 'btn active' : 'btn'}>
                    EN
                </button>
                |
                <button onClick={(e) => this.changeLanguage("lt")} className={this.props.localizationStore.language == 'lt' ? 'btn active' : 'btn'}>
                    LT
                </button>
            </div>
        </div>;
    }
}
