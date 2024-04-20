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
    window.location.href = '/signout';
  }
  const routes = ['/cv', '/outcoming-responses', '/vacancy', '/incoming-responses', '/personal', '/sign', 
    '/publicCompanies', '/promotion-requests', '/drop-requests', '/'];
  const currentTab = routes.find((route) => location.pathname.startsWith(route));
  const tabs = [<Tab key={0} label="Home" value="/" to="/" component={Link} />,
    <Tab key={1} label="Companies" value="/publicCompanies" to="/publicCompanies" component={Link} />]
  switch (userType) {
    case 'admin':
      tabs.push(<Tab label="Promotion" value="/promotion-requests" to="/promotion-requests" component={Link} />,
        <Tab label="Drop" value="/drop-requests" to="/drop-requests" component={Link} />)
      break;
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
      <Tab label="Logout" value="/signout" to="/signout" component={Link} />)
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