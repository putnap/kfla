import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Factor } from '../../models/Factor';
import { Competency } from '../../models/Competency';
import { FactorList } from '../FactorList';

interface EvaluationPrintTemplateProps {
    factors: Factor[]
    renderCompetency: (competency: Competency) => JSX.Element;
}

export class EvaluationPrintTemplate extends React.Component<EvaluationPrintTemplateProps, {}> {

    public render() {
        return <section>
            <div className='contentContainer background-light height-100 p-0'>
                <FactorList factors={this.props.factors} renderCompetency={this.props.renderCompetency} />
            </div>
        </section>;
    }
}