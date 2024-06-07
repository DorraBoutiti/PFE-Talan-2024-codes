import React from 'react';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Import images
import boardImage from './Assets/9.png';
import comparativeImage from './Assets/7.png';
import dashboardImage from './Assets/10.png';
import courseImage from './Assets/4.png';
import careerPathImage from './Assets/10.png';
import matchingImage from './Assets/6.png';
import ragImage from './Assets/2.png';
import videoSource from './Assets/Talan.mp4'; // Import video file

// Styles
const Root = styled('div')({
    flexGrow: 1,
    padding: '2rem',
    position: 'relative',
    color: '#fff',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    borderRadius: '8px',
    height: '400px',
    position: 'relative', // Ensure header acts as a positioned container for absolute elements
    overflow: 'hidden', // Hide any overflow content
});

const VideoBackground = styled('video')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const HeaderContent = styled('div')({
    position: 'absolute',
    //top: '50%',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    bottom: '2px',
    zIndex: 1, // Ensure content is above the video
    color: '#fff', // Text color
    textAlign: 'center', // Center the text
});

/*const HeaderTitle = styled(Typography)({
    fontSize: '2rem', // Adjust the font size as needed
    fontWeight: 'bold', // Make the text bold
    marginBottom: '1rem', // Add some spacing below the title
    color: '#1f4c8c',
});

const HeaderSubtitle = styled(Typography)({
    fontSize: '1.5rem', // Adjust the font size as needed
    marginBottom: '1rem', // Add some spacing below the subtitle
    color: '#fff',
});
*/
const HeaderButton = styled(Button)({
    margin: '1rem',
    color: '#fff', // Button text color
    
});

const AdditionalContent = styled('div')({
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#fff', // Background color
    color: '#fff', // Text color
    marginTop: '2rem', // Add margin to the top
    marginBottom: '1rem', // Add margin to the bottom
});

const AdditionalTitle = styled(Typography)({
    fontSize: '1.5rem', // Adjust the font size as needed
    fontWeight: 'bold', // Make the text bold
    marginBottom: '1rem', // Add some spacing below the title
});

const AdditionalSubtitle = styled(Typography)({
    fontSize: '1rem', // Adjust the font size as needed
    marginBottom: '1rem', // Add some spacing below the subtitle
});

const StyledButton = styled(Button)({
    margin: '1rem',
});

const StyledCard = styled(Card)({
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const Media = styled(CardMedia)({
    height: 200,
});

const AboutTalbot = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: 'BI dashboard',
            description: '',
            image: boardImage,
            link: '/bi/bi-gen',
        },
        {
            title: 'Comparative Analysis',
            description: '',
            image: comparativeImage,
            link: '/bi/bi-comp',
        },
        {
            title: 'Department statistics',
            description: '',
            image: dashboardImage,
            link: '/dep/dep-rh',
        },
        {
            title: 'Learning recommendation',
            description: '',
            image: courseImage,
            link: '/talbot/talbot-recommendation',
        },
        {
            title: 'Career paths',
            description: '',
            image: careerPathImage,
            link: '/talbot/talbot-recommendation',
        },
        {
            title: 'Job matching',
            description: '',
            image: matchingImage,
            link: '/talbot/talbot-matching',
        },
        {
            title: 'Chat with your data',
            description: '.',
            image: ragImage,
            link: '/talbot/talbot-data',
        },
    ];

    return (
        <Root>
            <Container>
                <Header>
                    <VideoBackground autoPlay loop muted>
                        <source src={videoSource} type="video/mp4" />
                        Your browser does not support the video tag.
                    </VideoBackground>
                    <HeaderContent>
                       
                        {/*<HeaderButton variant="contained" color="primary"  href="https://www.linkedin.com/posts/talan-tunisie_dans-ce-10%C3%A8me-%C3%A9pisode-de-talan-talks-tech-activity-7143193396604555265-XRsP?utm_source=share&utm_medium=member_desktop" target="_blank">
                            Learn more about our HR services
                        </HeaderButton>*/}
                        <HeaderButton variant="outlined" color="primary" href="https://www.linkedin.com/posts/talan-tunisie_dans-ce-10%C3%A8me-%C3%A9pisode-de-talan-talks-tech-activity-7143193396604555265-XRsP?utm_source=share&utm_medium=member_desktop" target="_blank">
                            Learn more about our HR services
                        </HeaderButton>
                    </HeaderContent>
                </Header>
                <AdditionalContent>
                    <AdditionalTitle variant="h2" component="h1" gutterBottom>
                        Welcome to TALBOT: Your HR Assistant Extraordinaire!
                    </AdditionalTitle>
                    <AdditionalSubtitle variant="h6" component="p" gutterBottom>
                        Hello there! 👋 Welcome to Talbot, your friendly and efficient HR assistant brought to you by Talan Company. We&apos;re here to revolutionize the way you manage talent and navigate the world of HR. Let&apos;s dive in and discover what makes Talbot so special!
                    </AdditionalSubtitle>
                    {/* Additional buttons or links */}
                </AdditionalContent>
                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StyledCard>
                                <Media
                                    image={service.image}
                                    title={service.title}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        {service.description}
                                    </Typography>
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(service.link)}
                                    >
                                        Learn More
                                    </StyledButton>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Root>
    );
};

export default AboutTalbot;
