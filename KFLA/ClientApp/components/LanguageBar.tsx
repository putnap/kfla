import * as React from 'react';
import { LocalizationStore } from '../stores/LocalizationStore';
import { inject, observer } from 'mobx-react';

interface LanguageBarProps {
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
@observer
export class LanguageBar extends React.Component<LanguageBarProps, {}> {

    constructor(props: LanguageBarProps) {
        super(props);

        this.changeLanguage = this.changeLanguage.bind(this);
    }

    changeLanguage(lang: string) {
        this.props.localizationStore.loadStrings(lang);
    }

    public render() {
        return <div className='lang'>
            {
                this.props.localizationStore.languages.map(language => {
                    return <button onClick={(e) => this.changeLanguage(language)} className={this.props.localizationStore.language == language ? 'btn active' : 'btn'} key={language}>
                        {language.toUpperCase()}
                    </button>
                })
            }
        </div>;
    }
}
