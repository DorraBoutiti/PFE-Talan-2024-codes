import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
//import { height, width } from '@mui/system';

// constant


// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      
      shadow,
      sx = { display: 'flex', flexWrap:'wrap', justifyContent: 'space-around' },
      
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card 
      
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: theme.palette.primary[200] + 25,
        ':hover': {
          boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
        },
        ...sx
      }}
      >

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass} >
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
