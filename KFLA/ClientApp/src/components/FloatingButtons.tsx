import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface FloatingButtonProps {
    icon: IconProp
    label: string
    onClick: () => any
    disabled?: boolean
    hidden?: boolean
}

const ButtonWithIcon = ({ icon, label, onClick, disabled = false, hidden = false }) => {
    return <button onClick={onClick} className='btn rounded-circle' title={label} disabled={disabled} hidden={hidden} >
        <FontAwesomeIcon icon={icon} />
    </button>
}

export const FloatingActionButtons: React.FC<{ floatingButtons: FloatingButtonProps[] }> = props => {
    return <div className='btn-floating-container'>
        {props.floatingButtons.map((button, i) => <ButtonWithIcon {...button} key={i} />)}
    </div>
}

