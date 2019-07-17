import * as React from 'react';
import { Competency } from '../../models/Competency';
import { render } from 'react-dom';
import { LocalizationStore } from '../../stores/LocalizationStore';
import { inject } from 'mobx-react';

interface CompetencyItemProps {
    competency: Competency;
    localizationStore?: LocalizationStore;
}

@inject("localizationStore")
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {

    render() {
        const competency = this.props.competency;
        return <div className='row'>
            <div className='col-1 p-0 text-right'>
                <span>{competency.ID}.</span>
            </div>
            <div className='col'>
                <p className='font-weight-bold'>{competency.Name}</p>
                <p>{competency.Description}</p>
            </div>
        </div>
    }
}


