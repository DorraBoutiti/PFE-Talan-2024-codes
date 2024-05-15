import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

// import AppTasks from '../app-tasks';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}> 
        <Grid xs={12} md={6} lg={8}>
          {/* <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          /> */}
        </Grid>
      </Grid>
    </Container>
  );
}
