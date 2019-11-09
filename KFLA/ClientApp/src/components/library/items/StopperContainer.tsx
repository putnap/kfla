import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { observer } from "mobx-react-lite";
import NavMenu from '../../NavMenu';
import { Loader } from '../../Loader';
import StopperItem from "./StopperItem";
import { LocalizationStore } from "../../../stores/LocalizationStore";
import { StoppersStore } from "../../../stores/StoppersStore";
import { LanguageParam } from "../../../@types/types";
import { useStore } from "../../../stores/hook";

interface StopperArgumentProps extends LanguageParam {
    stopperId: string
}

interface StopperContainerProps extends RouteComponentProps<StopperArgumentProps> {
    localizationStore?: LocalizationStore
    stoppersStore?: StoppersStore
}

const StopperWithLoader: React.FC<{ stopperId: string }> = observer(props => {
    const stoppersStore = useStore(stores => stores.stoppersStore);
    const { stopperId } = props;

    return !stoppersStore.isLoaded ?
        <Loader /> :
        <StopperItem stopper={stoppersStore.stoppers.find(s => s.ID.toString() === stopperId)} />

})

const StopperContainer: React.FC<StopperContainerProps> = props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { stopperId } = props.match.params;

    React.useEffect(() => localizationStore.setTitle('PageTitles.LIBRARY'));

    return <div className='row background-lib height-100  d-flex justify-content-center'>
        <NavMenu {...props}/>
        <div className='mx-2 mx-md-5 w-100 main-content' style={{ maxWidth: '1400px' }}>
            <div className='row card mb-2'>
                <div className='col card-body'>
                    <StopperWithLoader stopperId={stopperId} />
                </div>
            </div>
        </div>
    </div>

}

export default withRouter(StopperContainer);