'use client'
import Header from './Header'
import { fetchDoctors2, FetchFacilitiesData2, FetchHospitalDetails, FetchHospitalsData2, fetchNewsAndEvents2 } from "@/lib/fetchData";
import { setDoctors } from "@/redux/features/doctorSlice";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNewses } from '@/redux/features/newsSlice';
import { setHospitalDetails } from '@/redux/features/hospitalDetailSlice';
import { setHospitals } from '@/redux/features/hospitalSlice';
import { setFacilities } from '@/redux/features/facilitiesSlice';

const HeaderPage = () => {
    const dispatch = useDispatch();
    const fetchDoctorDetails = async () => {
        // setLoading1(true);
        try {
            const data = await fetchDoctors2();
            // console.log("API=", data, data?.length);
            if(data?.length)
                {dispatch(setDoctors(data));}
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading1(false);
        }
    };

    const fetchNewsDetails = async () => {
        // setLoading2(true);
        try {
            const data = await fetchNewsAndEvents2();
            if(data?.length)
                dispatch(setNewses(data))
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };

    const fetchHospitalDetails = async () => {
        // setLoading2(true);
        try {
            const data = await FetchHospitalDetails();
            // if(data?.leng)
                dispatch(setHospitalDetails(data))
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };

    const fetchHospitals = async () => {
        // setLoading2(true);
        try {
            const data = await FetchHospitalsData2();
            // if(data?.leng)
                dispatch(setHospitals(data))
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };

    const fetchFacilities = async () => {
        // setLoading2(true);
        try {
            const data = await FetchFacilitiesData2();
            // if(data?.leng)
                dispatch(setFacilities(data))
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };
    // FetchFacilitiesData2
    
    useEffect(() => {
        fetchDoctorDetails();
        fetchNewsDetails();
        fetchHospitalDetails();
        fetchHospitals();
        fetchFacilities();
    }, []);

    // console.log("Client API's", Doctors, news);

    return (<>
    <Header/>
    </>);
}

export default HeaderPage;
