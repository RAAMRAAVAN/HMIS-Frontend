'use client'
import { useSelector } from "react-redux";
import { selectDoctors } from "@/redux/features/doctorSlice";
import { Box, Grid } from "@mui/material";
import NewDoctorCard from '../../../(components)/NewDoctorCard';
const DisplayDoctors = ({ department }) => {
    const doctors = useSelector(selectDoctors);
    console.log("dept=", department);
    return (<>
        <Grid container width='90%'>
            {department !== null ? <>
                {doctors.map((doctor, index) => {
                    if (doctor.depertment === department)
                        return (
                            <Grid item lg={4} md={6} sm={12} xs={12}>
                                <Box padding={1} >
                                    <NewDoctorCard id={doctor.id}
                                        image={doctor.photo}
                                        name={doctor.name}
                                        speciality={doctor.specialization}
                                        designation={doctor.designation}
                                        department={doctor.depertment}
                                        qualifications={doctor.qualification} />
                                </Box>
                            </Grid>
                        )
                })}</>
             : <>{doctors.map((doctor, index) => {
                        return (
                            <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                                <Box padding={1} >
                                    <NewDoctorCard id={doctor.id}
                                        image={doctor.photo}
                                        name={doctor.name}
                                        speciality={doctor.specialization}
                                        designation={doctor.designation}
                                        department={doctor.depertment}
                                        qualifications={doctor.qualification} />
                                </Box>
                            </Grid>
                        )
                })}</>}


        </Grid>
    </>)
}

export default DisplayDoctors;