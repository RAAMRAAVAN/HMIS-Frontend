import {
    Autocomplete,
    TextField,
    InputAdornment,
    Box,
    Popper,
    Button,
    Grid,
    List,
    ListItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { color1, color4, MedantaOrange } from '../Global';
import { useRouter } from 'next/navigation';
import { setDoctorID } from '@/redux/features/doctorSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

const CustomPopper = ({
    inputValue,
    anchorEl,
    doctorList,
    specialityList,
    handleDoctorClick,
    handleSpecialityClick,
    children,
    doctors,
    openDoctors,
    setOpenDoctors,
    departments,
    setOpen,
    setInputValue,
    ...other
}) => {

    // console.log("departments=", uniqueDepartments);
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <Popper
            {...other}
            anchorEl={anchorEl}
            placement="bottom-start"
            modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
            style={{ display: 'flex', position: 'absolute', zIndex: 2 }}
        >
            <Grid
                container
                onMouseDown={(e) => e.stopPropagation()}
                sx={{
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    width: anchorEl?.clientWidth || '100%', // <-- FORCE WIDTH
                    height: '100vh'
                }}
            >
                <Grid item xs={12} display='flex' flexDirection='column' width='100%' boxShadow={3} bgcolor='white' sx={{ position: 'absolute', top: '-30px', borderRadius: '0px 0px 10px 10px', paddingTop: 3, zIndex: 4 }}>
                    {inputValue.length > 0 && (
                        <Box
                            sx={{
                                boxShadow: 'none',
                                border: 'none',

                                '& .MuiAutocomplete-paper': {
                                    boxShadow: 'none !important',
                                    border: 'none !important',
                                },
                                '& .MuiAutocomplete-option': {
                                    color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#f1f1f1',
                                    },
                                },
                            }}
                        >
                            {children}
                        </Box>
                    )}
                    <Box borderTop="1px solid #eee" paddingTop={3}/>
                    <Grid container paddingX={3} paddingBottom={1} spacing={3} justifyContent='space-between' marginBottom={1}>
                        {/* Doctors Button  */}
                        <Grid item xs={6}>
                            <Button
                                sx={{
                                    color: 'black',
                                    borderBottom: '1px gray solid',
                                    justifyContent: 'space-between',
                                    textTransform: 'none',
                                    borderRadius: '0px',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}
                                fullWidth
                                endIcon={<KeyboardArrowDown sx={{ color: 'gray' }} />}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleDoctorClick}
                            >
                                Doctors
                            </Button>
                            {openDoctors && (
                                <Box
                                    sx={{
                                        // border: '1px gray solid',
                                        padding: 1,
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        borderRadius: '0px 0px 10px 10px',
                                        // marginTop: 1,
                                        zIndex: 1000,
                                        left: 0
                                    }}
                                    boxShadow={3}
                                >
                                    <Box
                                        sx={{
                                            maxHeight: '50vh',
                                            overflowY: 'auto',
                                            display: 'flex',
                                            width: '380px',
                                        }}
                                    >
                                        <List>
                                            {doctors.map((doctor, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{ cursor: 'pointer' }}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setInputValue(doctor.name);
                                                        setOpenDoctors(false);
                                                        dispatch(setDoctorID(doctor.id));
                                                        router.push('/kioskHome/consultants/doctor_details');
                                                    }}
                                                >
                                                    {doctor.name}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Box>
                            )}
                        </Grid>

                        {/* Speciality Button  */}
                        <Grid item xs={6}>
                            <Button
                                sx={{
                                    color: 'black',
                                    borderBottom: '1px gray solid',
                                    justifyContent: 'space-between',
                                    textTransform: 'none',
                                    borderRadius: '0px',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}
                                fullWidth
                                endIcon={<KeyboardArrowDown sx={{ color: 'gray' }} />}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleSpecialityClick}
                            >
                                Department
                            </Button>
                            {specialityList && inputValue.length === 0 && (
                                <Box
                                    sx={{
                                        // border: '1px gray solid',
                                        padding: 1,
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        borderRadius: '0px 0px 10px 10px',
                                        // marginTop: 1,
                                        right: 0
                                    }}
                                    boxShadow={3}
                                >
                                    <Box
                                        sx={{
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                            display: 'flex',
                                            width: '380px',
                                        }}
                                    >
                                        <List>
                                            {departments.map((department, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{ cursor: 'pointer' }}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setInputValue(department);
                                                        router.push(`/kioskHome/consultants?department=${encodeURIComponent(department)}`);
                                                    }}
                                                >
                                                    {department}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Popper>
    );
};

const SearchDoctors = ({ doctors }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors); 
    const dispatch = useDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openDoctors, setOpenDoctors] = useState(false);
    const [doctorList, setDoctorList] = useState(false);
    const [specialityList, setSpecialityList] = useState(false);
    const [departments, setDepartments] = useState([]);

    const FilterDoctors = () => {
        setFilteredDoctors(doctors.filter(doc =>
            doc.depertment !== 'Hospital Administration'
        ))
    }
    // console.log("filtered=", filteredDoctors);

    const wrapperRef = useRef();

    // Close dropdowns on outside click

    useEffect(() => {
        if (doctors.length > 0) {
            FilterDoctors();
            const uniqueDepartments = [...new Set(
                doctors
                    .map(doc => doc.depertment)
                    .filter(dep => dep && dep.toLowerCase() !== 'hospital administration') // removes undefined/null/empty strings
            )];
            //   console.log("working data", uniqueDepartments)
            setDepartments(uniqueDepartments);
        }
    }, [doctors]);

    useEffect(() => {
        
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setDoctorList(false);
                setSpecialityList(false);
                setOpenDoctors(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDoctorClick = (e) => {
        e.stopPropagation();
        setDoctorList((prev) => !prev);
        setOpenDoctors(!openDoctors);
        setSpecialityList(false);
        setInputValue('');
    };

    const handleSpecialityClick = (e) => {
        e.stopPropagation();
        setSpecialityList((prev) => !prev);
        setDoctorList(false);
        setOpenDoctors(false);
        setInputValue('');
    };

    return (
        <Box ref={wrapperRef} display="flex" width="100%" flexDirection="column" position="relative" >
            <Autocomplete
                options={filteredDoctors}
                disableCloseOnBlur
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ''}
                freeSolo

                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    setOpenDoctors(false);
                }}
                onChange={(event, newValue) => {
                    dispatch(setDoctorID(newValue.id));
                    router.push('/kioskHome/consultants/doctor_details');
                    setOpen(false);
                    
                }}
                PopperComponent={(props) => (
                    <Box width='100%' position='relative'>
                        <CustomPopper
                            {...props}
                            inputValue={inputValue}
                            doctorList={doctorList}
                            setOpen={setOpen}
                            doctors={filteredDoctors}
                            openDoctors={openDoctors}
                            setOpenDoctors={setOpenDoctors}
                            departments={departments}
                            specialityList={specialityList}
                            handleDoctorClick={handleDoctorClick}
                            handleSpecialityClick={handleSpecialityClick}
                            setInputValue={setInputValue}
                        />
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search for Doctors & Departments"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    bgcolor="white"
                                    borderRadius="50%"
                                    position='absolute'
                                    height="50px"
                                    width="50px"
                                    right='1px'
                                >
                                    <InputAdornment>
                                        <SearchIcon sx={{ color: color4, fontSize: '24px' }} />
                                    </InputAdornment>
                                </Box>
                            ),
                        }}
                        sx={{
                            borderRadius: 20,
                            // backgroundColor: MedantaOrange,
                            backgroundColor: color4,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                                '& input::placeholder': {
                                    color: 'white',
                                    opacity: 1,
                                    fontSize: 18,
                                    // border:'1px black solid',
                                    marginY:0
                                },
                            },
                            position: 'relative',
                            zIndex: 3,
                            padding:1,
                            // border:'1px black solid',
                            margin:0
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default SearchDoctors;
