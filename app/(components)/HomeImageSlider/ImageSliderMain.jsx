'use client'
import ImageSlider from './ImageSlider'
import { ImageSliderData } from '../../../lib/fetchData';
import { useEffect, useState } from 'react';
const ImageSliderMain = () => {
    const [images, setImages] = useState([]);
    const fetchImageSlider = async () => {
        // setLoading2(true);
        try {
            const data = await ImageSliderData();
            setImages(data);
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };

    useEffect(() => {
        fetchImageSlider();
    }, [])

    return (<>
        <ImageSlider Images={images} />
    </>);
}
export default ImageSliderMain
