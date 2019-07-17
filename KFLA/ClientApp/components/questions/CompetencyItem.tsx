import * as React from 'react';
import { Competency } from '../../models/Competency';
import { observer } from 'mobx-react';
import { render } from 'react-dom';

interface CompetencyItemProps {
    competency: Competency;
}

@observer
export class CompetencyItem extends React.Component<CompetencyItemProps, {}> {
    render() {
        const competency = this.props.competency;
        return <div className='row'>
            <div className='col-1 p-0'>
                <label className='check-container'>
                    <input type='checkbox' checked={competency.IsSelected} onChange={(e) => competency.toggleSelection()} />
                    <span className='checkmark'></span>
                </label>
            </div>
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


