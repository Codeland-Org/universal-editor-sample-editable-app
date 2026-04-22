import React from 'react';
import AEMPage from '../../components/AEMPage';
import { getAEMPath } from '../../utils/commons';

export default async function Page(props) {
    const params = await props.params;
    const slug = params.slug;
    const aemPath = getAEMPath(slug);

    return (
        <AEMPage path={aemPath} />
    );
}
