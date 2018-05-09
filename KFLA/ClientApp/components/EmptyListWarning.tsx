import * as React from 'react';
import { Button } from './Button';

export class EmptyListWarning extends React.Component<any, any> {

    public render() {
        return (
            <div className='col'>
                <p className='text-center'>It looks like you don't have any data loaded.</p>
                <p className='text-center'>
                    <Button link={true} href={'api/competencies/initialize'} extraClassNames={['btn-success']}>
                        Reload data
                    </Button>
                </p>
            </div>
        )
    }


}
