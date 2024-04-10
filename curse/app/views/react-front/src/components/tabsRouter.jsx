import { useCookies } from 'react-cookie';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';

function MyTabs() {
  const [cookies] = useCookies(['user_type', 'username']);
  const userName = localStorage.userName;
  const userType = cookies.user_type;
  if (!userName && userType) {
    window.location.href = '/logout';
  }
  const routes = ['/cv', '/outcoming-responses', '/vacancy', '/incoming-responses', '/personal', '/sign', '/'];
  const currentTab = routes.find((route) => location.pathname.startsWith(route));
  const tabs = [<Tab key={0} label="Home" value="/" to="/" component={Link} />]
  switch (userType) {
    case 'regular':
      tabs.push(<Tab label="CVs" value="/cv" to="/cv" component={Link} />,
        <Tab label="Responses" value="/outcoming-responses" to="/outcoming-responses" component={Link} />)
      break;
    case 'company':
      tabs.push(<Tab label="Vacancies" value="/vacancy" to="/vacancy" component={Link} />,
        <Tab label="Responses" value="/incoming-responses" to="/incoming-responses" component={Link} />)
      break;
    default:
      tabs.push(<Tab label="Sign" value="/sign" to="/sign" component={Link} />);
      break;
  }
  if (userType) {
    tabs.push(<Tab label={userName.length < 12 ? userName : (userName.substring(0, 12) + '...')} value="/personal" 
          to="/personal" component={Link} />,
      <Tab label="Logout" value="/logout" to="/logout" component={Link} />)
  }

  return (
    <Tabs value={currentTab}>
      {tabs}
    </Tabs>
  );
}

export default function TabsRouter() {
  return (
    <Box sx={{ width: '100%' }}>
        <MyTabs />
    </Box>
  );
}