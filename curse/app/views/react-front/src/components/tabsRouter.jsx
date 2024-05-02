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
    '/publicCompanies', '/promotion-requests', '/drop-requests', '/reports', '/black-list', '/'];
  const currentTab = routes.find((route) => location.pathname.startsWith(route));
  const tabs = [<Tab key={0} label="Домашняя" value="/" to="/" component={Link} />,
    <Tab key={1} label="Компании" value="/publicCompanies" to="/publicCompanies" component={Link} />]
  switch (userType) {
    case 'admin':
      tabs.push(<Tab label="Повышения" value="/promotion-requests" to="/promotion-requests" component={Link} />,
        <Tab label="Удаления" value="/drop-requests" to="/drop-requests" component={Link} />,
        <Tab label="Жалобы" value="/reports" to="/reports" component={Link} />,
        <Tab label="Баны" value="/black-list" to="/black-list" component={Link} />)
      break;
    case 'regular':
      tabs.push(<Tab label="Мои резюме" value="/cv" to="/cv" component={Link} />,
        <Tab label="Отклики" value="/outcoming-responses" to="/outcoming-responses" component={Link} />)
      break;
    case 'company':
      tabs.push(<Tab label="Вакансии" value="/vacancy" to="/vacancy" component={Link} />,
        <Tab label="Отклики" value="/incoming-responses" to="/incoming-responses" component={Link} />)
      break;
    default:
      tabs.push(<Tab label="Вход" value="/sign" to="/sign" component={Link} />);
      break;
  }
  if (userType) {
    tabs.push(<Tab label={userName.length < 12 ? userName : (userName.substring(0, 12) + '...')} value="/personal" 
          to="/personal" component={Link} />,
      <Tab label="Выйти" value="/signout" to="/signout" component={Link} />)
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