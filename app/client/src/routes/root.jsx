import { 
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
import * as React from 'react';

// MUI
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Icon from '@mui/material/Icon';

export async function action() {
  return {  };
}

export async function loader() {
  return {  };
}

export default function Root() {
  const location = useLocation();
  let paths = location.pathname.split('/');
  let path = paths[1] || '';
  const [value, setValue] = React.useState(path);

  return (

    <>
      <Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction 
              component={Link}
              to="/cafes"
              label="Cafes"
              value="cafes"
              icon={<Icon>home</Icon>} />
          <BottomNavigationAction 
              component={Link}
              to="/employees"
              label="Employees"
              value="employees"
              icon={<Icon>perm_identity</Icon>} />
        </BottomNavigation>
      </Box>

      <Outlet />
    </>

    );
}