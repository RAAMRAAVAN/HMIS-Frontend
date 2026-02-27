// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Box, Typography } from '@mui/material';
// import { useRouter } from 'next/navigation';



// // const items = [
// //     {
// //         title:
// //             'Celebrated ACCF Foundation Day on 28th April',
// //         url: '/news',
// //     },
// // ];

// const TextCarousel = ({ updates }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const router = useRouter();

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex((prevIndex) => (prevIndex + 1) % updates.length);
//         }, 5000); // Change item every 5 seconds

//         return () => clearInterval(interval);
//     }, [updates.length]);

//     const currentUpdate = updates[currentIndex];
//     return (<>
//         <Box
//             sx={{
//                 width: '100%',
//                 overflow: 'hidden',
//                 backgroundColor: '#ebebeb',
//                 cursor: 'pointer',
//                 display: 'flex',

//             }}

//         >
//             <Typography
//                 sx={{
//                     color: '#fff',
//                     background: 'linear-gradient(-240deg, #bf1e2e 75%, transparent 40%)',
//                     px: 1,
//                     // py: 1,
//                     pr: 4,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     flexShrink: 0,
//                     margin: '0px 0 0px -2px',
//                     padding: '0 32px 0 5px',
//                     zIndex: '1'
//                 }}
//             >
//                 UPDATES
//             </Typography>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 1,
//                             width: '100%',
//                             animation: 'stepScroll 7s ease-in-out infinite',
//                         }}
//                         onClick={() => { router.push(updates[currentIndex].link) }}
//                     >
//                         <Box
//                             sx={{
//                                 position: 'relative',
//                                 overflow: 'hidden',
//                                 width: '100%',
//                                 backgroundColor: '#ebebeb'
//                             }}
//                         >
//                             <Box
//                                 sx={{
//                                     display: 'inline-block',
//                                     whiteSpace: 'nowrap',
//                                 }}
//                             >
//                                 <Typography
//                                     sx={{
//                                         color: '#002664',
//                                         fontSize: '14px',
//                                         fontWeight: 500,
//                                         backgroundColor: '#ebebeb',
//                                         pr: 0,
//                                         display: 'inline-block',
//                                     }}
//                                 >
//                                     {updates[currentIndex].name}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                     </Box>

//             <style jsx>{`
//                         @keyframes stepScroll {
//                             0% {
//                             transform: translateX(0%);
//                             opacity: 1;
//                             }
//                             50%{
//                             transform: translateX(0%);
//                             opacity: 1;
//                             }
//                             80% {
//                             transform: translateX(-100%);
//                             opacity: 0;
//                             }
//                             90% {
//                             transform: translateX(100%);
//                             opacity: 0;
//                             }
//                             100% {
//                             transform: translateX(0%);
//                             opacity: 1;
//                             }
//                         }
//                             `}
//             </style>
//         </Box>
//     </>
//     );
// };

// export default TextCarousel;

'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const TextCarousel = ({ updates }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    // Change item every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % updates.length);
        }, 15000);

        return () => clearInterval(interval);
    }, [updates.length]);

    if (!updates || updates.length === 0) return null;

    const currentUpdate = updates[currentIndex];

    return (
        <Box
            sx={{
                width: '100%',
                overflow: 'hidden',
                backgroundColor: '#ebebeb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
            }}
            onClick={() => router.push(currentUpdate.link)}
        >
            <Typography
                sx={{
                    color: '#fff',
                    background: 'linear-gradient(-240deg, #bf1e2e 75%, transparent 40%)',
                    px: 1,
                    pr: 4,
                    borderRadius: '4px',
                    fontSize: '14px',
                    flexShrink: 0,
                    margin: '0px 0 0px -2px',
                    padding: '0 32px 0 5px',
                    zIndex: 1
                }}
            >
                UPDATES
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    paddingLeft: '10px',
                    position: 'relative'
                }}
            >
                <Typography
                    key={currentIndex} // forces re-render to trigger animation
                    sx={{
                        color: '#002664',
                        fontSize: '14px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        animation: 'fadeSlide 1s ease-in-out',
                        position: 'relative',
                    }}
                >
                    {currentUpdate.name}
                </Typography>
            </Box>

            <style jsx>{`
                @keyframes fadeSlide {
                    0% {
                        opacity: 0;
                        transform: translateX(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </Box>
    );
};

export default TextCarousel;

