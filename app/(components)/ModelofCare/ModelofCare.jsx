import { ExpandCircleDownRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { color3, MedantaOrange } from "../Global";
import './ModelofCare.css';
import CircleWithMarker from './CircleWithMarker';
import Image from "next/image";
const ModelofCare = () => {
    return (<>
        <Box display='flex' width='100%' flexDirection='column' alignItems='center'>
            <Typography fontWeight='bold' fontSize={20} color="#58595b">Medanta Model of Care</Typography>
            <Box marginY={1} display='flex' alignItems='center' flexDirection='column'>
                <Typography fontWeight='bold' fontSize={18} color="#58595b">Exceptional</Typography>
                <Typography fontWeight='bold' fontSize={18} color="#58595b">clinical talent</Typography>
            </Box>
            <Box display='flex' alignItems='center' className='KnowMoreContainer' marginRight={2}>
                <Typography fontSize={13} color="gray" fontWeight='bold' marginRight={1} className="KnowMore">Know More</Typography>
                <ExpandCircleDownRounded sx={{ color: MedantaOrange, fontSize: 30, transform: 'rotate(270deg)' }} className="ExpandButton" />
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' width='500px' height='500px'>
                <Image
                    src="/SCI/CareModel/Care.webp"
                    alt="background"
                    width={400}
                    height={400}
                    priority
                />

                {/* <Box display='flex' border='1px black dashed' width={500} height={500} position='absolute' borderRadius='50%'></Box> */}
                <Box display='flex' border='1px black dashed' width={500} height={500} position='absolute' borderRadius='50%'>
                    <CircleWithMarker angleDegArray={[0, 72, 144, 216, 288]} />
                </Box>
            </Box>

        </Box>
    </>)
}
export default ModelofCare;