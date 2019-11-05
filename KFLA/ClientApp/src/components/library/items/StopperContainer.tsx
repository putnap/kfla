import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps } from "react-router";
import NavMenu from '../../NavMenu';
import { Loader } from '../../Loader';
import StopperItem from "./StopperItem";
import { LocalizationStore } from "../../../stores/LocalizationStore";
import { StoppersStore } from "../../../stores/StoppersStore";
import { LanguageParam } from "../../../@types/types";

interface StopperArgumentProps extends LanguageParam {
    stopperId: string
}

interface StopperContainerProps extends RouteComponentProps<StopperArgumentProps> {
    localizationStore?: LocalizationStore
    stoppersStore?: StoppersStore
}

@inject("localizationStore", "stoppersStore")
@observer
export class StopperContainer extends React.Component<StopperContainerProps, {}> {

    async componentDidMount() {
        this.props.localizationStore.setTitle('PageTitles.LIBRARY');
        const { stoppersStore } = this.props;
        if (!stoppersStore.isLoaded)
            await stoppersStore.fetchStoppers();
    }

    public render() {
        const { stopperId } = this.props.match.params;
        const { localizationStore, stoppersStore } = this.props;
        return <div className='row background-lib height-100  d-flex justify-content-center'>
            <NavMenu {...this.props}/>
            <div className='mx-2 mx-md-5 w-100 main-content' style={{ maxWidth: '1400px' }}>
                <div className='row card mb-2'>
                    <div className='col card-body'>
                        {
                            !stoppersStore.isLoaded ?
                                <Loader text={localizationStore.getString('Stoppers.Loading')} /> :
                                <StopperItem stopper={stoppersStore.stoppers.find(s => s.ID.toString() === stopperId)} />
                        }
                    </div>
                </div>
            </div>
        </div>

    }
}