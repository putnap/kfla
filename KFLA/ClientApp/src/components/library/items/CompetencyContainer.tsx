import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";

import { LocalizationStore } from "../../../stores/LocalizationStore";
import NavMenu from '../../NavMenu';
import { Loader } from '../../Loader';
import { CompetencyStore } from "../../../stores/CompetencyStore";
import { LanguageParam } from "../../../@types/types";
import CompetencyItem from "./CompetencyItem";
import { useStore } from "../../../stores/hook";

interface CompetencyArgumentProps extends LanguageParam {
    competencyId: string
}

interface CompetencyContainerProps extends RouteComponentProps<CompetencyArgumentProps> {
    localizationStore?: LocalizationStore
    competencyStore?: CompetencyStore
}

const CompetencyWithLoader: React.FC<{ competencyId: string }> = observer(props => {
    const competencyStore = useStore(stores => stores.competencyStore);
    const { competencyId } = props;

    return !competencyStore.isLoaded ?
        <Loader /> :
        <CompetencyItem competency={competencyStore.competencies.find(c => c.ID.toString() === competencyId)} />

})

export const CompetencyContainer: React.FC<CompetencyContainerProps> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { competencyId } = props.match.params;

    React.useEffect(() => localizationStore.setTitle('PageTitles.LIBRARY'));

    return <div className='row background-lib height-100 d-flex justify-content-center' >
        <NavMenu {...props} />
        <div className='mx-2 mx-md-5 w-100 main-content' style={{ maxWidth: '1400px' }}>
            <div className='row card mb-2 ' >
                <div className='col card-body'>
                    <CompetencyWithLoader competencyId={competencyId} />
                </div>
            </div>
        </div>
    </div>
}
