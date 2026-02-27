import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Restore, Favorite, Dehaze } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaStethoscope } from "react-icons/fa";
import { IoIosCall } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { RiContactsLine } from 'react-icons/ri';

const BottomNavigationComponent = ({setMobileOpen, mobileOpen}) => {
  const theme = useTheme();
  const isSmOrXs = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  return (
    isSmOrXs && (
      <BottomNavigation
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1300, // keep above other elements
          display: { xs: 'flex', sm: 'flex', md: 'none' }, // hide on md and up
        }}
      >
        <BottomNavigationAction onClick={()=>{setMobileOpen(!mobileOpen)}} icon={<Dehaze/>} />
        <BottomNavigationAction label="Doctors" onClick={()=>{router.push('/consultants')}} icon={<FaStethoscope />} />
        <BottomNavigationAction label="Contact Us" onClick={()=>{router.push('/contact')}} icon={<RiContactsLine size={24} color="gray" />} />
      </BottomNavigation>
    )
  );
};

export default BottomNavigationComponent;
