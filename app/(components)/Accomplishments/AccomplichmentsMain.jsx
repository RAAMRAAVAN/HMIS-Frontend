'use client'
import Accomplishments from './Accomplishments'
import { fetchAccomplishments2 } from '../../../lib/fetchData';
import { useEffect, useState } from 'react';
const ImageSliderMain = () => {
    const [accomplishments, setAccomplishments] = useState({});

    const fetchAccomplishments = async() => {
        setAccomplishments(await fetchAccomplishments2())
    }
    useEffect(() => {
        fetchAccomplishments();
    }, [])

    return (<>
        <Accomplishments accomplishments={accomplishments} />
    </>);
}
export default ImageSliderMain;