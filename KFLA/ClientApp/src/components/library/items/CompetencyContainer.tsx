import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps, Route } from "react-router";
import { LocalizationStore } from "../../../stores/LocalizationStore";
import NavMenu from '../../NavMenu';
import { Loader } from '../../Loader';
import { CompetencyStore } from "../../../stores/CompetencyStore";
import { LanguageParam } from "../../../@types/types";
import CompetencyItem from "./CompetencyItem";

interface CompetencyArgumentProps extends LanguageParam {
    competencyId: string
}

interface CompetencyContainerProps extends RouteComponentProps<CompetencyArgumentProps> {
    localizationStore?: LocalizationStore
    competencyStore?: CompetencyStore
}

@inject("localizationStore", "competencyStore")
@observer
export class CompetencyContainer extends React.Component<CompetencyContainerProps, {}> {

    async componentDidMount() {
        this.props.localizationStore.setTitle('PageTitles.LIBRARY');
        const { competencyStore } = this.props;
        if (!competencyStore.isLoaded)
            await competencyStore.fetchCompetencies();
    }
    
    public render() {
        const { competencyId } = this.props.match.params;
        const { localizationStore, competencyStore } = this.props;
        return <div className='row background-lib height-100 d-flex justify-content-center' >
            <NavMenu {...this.props} />
            <div className='mx-2 mx-md-5 w-100 main-content' style={{ maxWidth: '1400px' }}>
                <div className='row card mb-2 ' >
                    <div className='col card-body'>
                        {
                            !competencyStore.isLoaded ?
                                <Loader text={localizationStore.getString('Questionaire.Loading')} /> :
                                <CompetencyItem competency={competencyStore.competencies.find(c => c.ID.toString() == competencyId)} />
                        }
                    </div>
                </div>
            </div>
        </div>

    }
}
