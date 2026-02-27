import {
  Box,
  Drawer,
  List,
  ListItem,
  Collapse,
  ListItemButton,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { ExpandLess, ExpandMore, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { RiContactsLine } from "react-icons/ri";
import { IoIosCall, IoIosMail } from "react-icons/io";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about_us" },
  { name: "Facilities", link: "/facilities" },
  { name: "Hospitals" },
  { name: "News & Events", link: "/news" },
  // { name: "Academics", link: "/academics" },
  { name: "Contact Us" },
];

export const MobileView = ({ mobileOpen, handleDrawerToggle, OurHospitals }) => {
  const [openHospitalDropdown, setOpenHospitalDropdown] = useState(false);
  const [openContactDropdown, setOpenContactDropdown] = useState(false);

  const handleHospitalClick = () => setOpenHospitalDropdown(!openHospitalDropdown);
  const handleContactClick = () => setOpenContactDropdown(!openContactDropdown);
  const handleClose = () => {
    handleDrawerToggle();
    setOpenHospitalDropdown(false);
    setOpenContactDropdown(false);
  };

  return (
    <Drawer anchor="right" open={mobileOpen} onClose={handleClose}>
      <Box sx={{ width: '100vw', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: "auto", flexGrow: 1 }} role="presentation" onKeyDown={handleClose}>
          <List>
            {navItems.map((item) => {
              if (item.name === "Hospitals") {
                return (
                  <Box key="Hospitals">
                    <ListItemButton onClick={handleHospitalClick}>
                      <Typography variant="body1" fontWeight={500}>Hospitals</Typography>
                      {openHospitalDropdown ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openHospitalDropdown} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {OurHospitals.map((hospital) => (
                          <Link key={hospital.name} href={hospital.location} passHref legacyBehavior>
                            <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                              <ListItem component="div" sx={{ pl: 4 }}>
                                <Typography variant="body2">{hospital.name}</Typography>
                              </ListItem>
                            </a>
                          </Link>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                );
              } else if (item.name === "Contact Us") {
                return (
                  <Box key="Contact Us">
                    <ListItemButton onClick={handleContactClick}>
                      <Typography variant="body1" fontWeight={500}>Contact Us</Typography>
                      {openContactDropdown ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openContactDropdown} timeout="auto" unmountOnExit>
                      <Box>
                        <Box paddingY={1} paddingX={3} onClick={handleClose} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'lightgray' } }}>
                          <Link href="/contact" passHref legacyBehavior>
                            <Box display='flex' alignItems="center">
                              <RiContactsLine size={24} color="gray" />
                              <Typography ml={1} color="#454545">Contact Us</Typography>
                            </Box>
                          </Link>
                        </Box>

                        <Box paddingY={1} paddingX={3} sx={{ cursor: 'pointer', borderTop: '1px lightgray solid', '&:hover': { backgroundColor: 'lightgray' } }}>
                          <Box onClick={handleClose} display='flex' alignItems="center">
                            <IoIosCall size={25} color="gray" />
                            <Typography component="a" href="tel:+9118003454325" sx={{ cursor: "pointer" }} color="#454545" ml={1}>
                              +91 18003454325
                            </Typography>
                          </Box>
                        </Box>

                        <Box paddingY={1} paddingX={3} sx={{ cursor: 'pointer', borderTop: '1px lightgray solid', '&:hover': { backgroundColor: 'lightgray' } }}>
                          <Box onClick={handleClose} display='flex' alignItems="center">
                            <IoIosMail size={24} color="gray" />
                            <Typography component="a" href="mailto:info@accf.in" sx={{ cursor: "pointer" }} color="#454545" ml={1}>
                              info@accf.in
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                );
              } else {
                return (
                  <Link key={item.name} href={item.link} passHref legacyBehavior>
                    <ListItem component="div" onClick={handleClose}>
                      <Typography variant="body1">{item.name}</Typography>
                    </ListItem>
                  </Link>
                );
              }
            })}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileView;
