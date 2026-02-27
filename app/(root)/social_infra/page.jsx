// import { SocialInfra } from "@/lib/fetchData";
import { Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
const page = () => {
    // const SocialInfraDetails = SocialInfra;
    return (<>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" >
            <Typography variant="h5" fontWeight="bold" marginTop={2}>SOCIAL INFRASTRUCTURE</Typography>
            <Typography variant="h6" marginBottom={2} textAlign="center" fontSize={14}>Know your location and get familiarized along</Typography>
            <Grid container width="95%" display="flex" marginY={3}  height='600px'>
                {/* {SocialInfraDetails.map((item, index) => {
                    return (<Grid key={item.id} item lg={2} md={4} xs={12} sx={{ marginBottom: 1, display:'flex', flexDirection:'column', height:'100%'}}>
                        <Box justifyContent="center" alignItems="center" display="flex" style={{ backgroundColor: "black", border: "1px white solid", height:'30%' }} paddingX={1} paddingY={3}>
                            <Typography color="white" textAlign='center'>{item.Title}</Typography>
                        </Box>
                        <Box  display="flex" sx={{ border: "1px gray solid", height:'70%' }} paddingX={1} paddingY={3}>
                            <List sx={{ listStyleType: "disc", pl: 2 }}>
                                {item.Description.map((desc, index2) => {
                                    return (<ListItem key={index2} sx={{ display: "list-item", color: "black", padding: "0", margin: "0" }}>
                                        <ListItemText primaryTypographyProps={{ fontSize: '14px' }} primary={desc} />
                                    </ListItem>)
                                })}
                            </List>
                        </Box>
                    </Grid>)
                })} */}
            </Grid>
        </Box>
    </>)
}
export default page;