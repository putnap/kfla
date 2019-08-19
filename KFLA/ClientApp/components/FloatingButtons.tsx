import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface FloatingButtonProps {
    icon: IconProp
    label: string
    onClick: () => any
    disabled?: boolean
}

const ButtonWithIcon = ({ icon, label, onClick, disabled = false }) => {
    return <button onClick={onClick} className='btn rounded-circle' title={label} disabled={disabled} >
        <FontAwesomeIcon icon={icon} />
    </button>
}

export const FloatingActionButtons: React.FunctionComponent<{ floatingButtons: FloatingButtonProps[] }> = props => {
    return <div className='btn-floating-container'>
        {props.floatingButtons.map((button, i) => <ButtonWithIcon {...button} key={i} />)}
    </div>
}

