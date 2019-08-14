import * as React from 'react';
import { LocalizationStore } from '../stores/LocalizationStore';
import { inject, observer } from 'mobx-react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { compile } from 'path-to-regexp';

interface LanguageBarProps extends RouteComponentProps<{}> {
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class LanguageBar extends React.Component<LanguageBarProps, {}> {

    constructor(props: LanguageBarProps) {
        super(props);

        this.getUrl = this.getUrl.bind(this);
    }

    getUrl(language: string): string {
        const { match } = this.props;
        const toPath = compile(match.path);
        const newPath = toPath({ ...match.params, language: language });

        if (newPath.endsWith("/"))
            return newPath.substring(0, newPath.length - 1);

        return newPath;
    }

    public render() {
        return <div className='lang'>
            {
                this.props.localizationStore.languages.map(language => {
                    return <NavLink to={this.getUrl(language)} activeClassName='active' className='btn' key={language}>
                        {language.toUpperCase()}
                    </NavLink>
                })
            }
        </div>;
    }
}
