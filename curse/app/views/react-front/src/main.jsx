import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './assets/index.css';
import './assets/sign.css';
import Root from './routes/root';
import ErrorPage from './error-page';
import Vacancies, { loader as vacanciesLoader, } from './routes/vacancies';
import EditVacancy, { loader as editVacancyLoader, } from './routes/editVacancy';
import Vacancy, { loader as vacancyLoader, } from './routes/vacancy';
import Index, { loader as indexLoader } from './routes/index';
import CVs, { loader as cvsLoader } from './routes/cv';
import EditCv, { loader as cvLoader } from './routes/editCv';
import Personal, { loader as personalLoader } from './routes/personal';
import CompanyInfo, { loader as companyInfoLoader } from './routes/company';
import OutcomingResponses, { loader as outcomingResponseLoader } from './routes/outcomingResponses';
import IncomingResponses, { loader as incomingResponseLoader } from './routes/incomingResponses';
import Sign from './routes/sign';
import Logout from './routes/logout';
import Reviews, { loader as reviewsLoader } from './routes/reviews';
import PublicCompanies, { loader as publicCompaniesLoader } from './routes/publicCompanies';
import CreateReview, { loader as createReviewLoader } from './routes/createReview';
import PromotionRequests, { loader as PromotionRequestsLoader } from './routes/promotionRequests';
import DropRequests, { loader as dropRequestsLoader } from './routes/dropRequests';
import { AlertProvider } from './components/useAlert';
import Reports, { loader as reportsLoader } from './routes/reports';
import BlackList, { loader as blackListLoader } from './routes/blackList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage/>,
    children: [
      { 
        index: true, 
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: 'cv',
        element: <CVs/>,
        loader: cvsLoader,
      },
      {
        path: 'cv/edit/:cvId',
        element: <EditCv />,
        loader: cvLoader,
      },
      {
        path: 'outcoming-responses',
        element: <OutcomingResponses/>,
        loader: outcomingResponseLoader
      },
      {
        path: 'incoming-responses',
        element: <IncomingResponses/>,
        loader: incomingResponseLoader
      },
      {
        path: 'vacancy',
        element: <Vacancies />,
        loader: vacanciesLoader,
      },
      {
        path: 'vacancy/edit/:vacancyId',
        element: <EditVacancy />,
        loader: editVacancyLoader,
      },
      {
        path: 'vacancy/:vacancyId',
        element: <Vacancy />,
        loader: vacancyLoader,
      },
      {
        path: 'personal',
        element: <Personal />,
        loader: personalLoader
      },
      {
        path: 'company/:companyId',
        element: <CompanyInfo />,
        loader: companyInfoLoader
      },
      {
        path: 'publicCompanies',
        element: <PublicCompanies />,
        loader: publicCompaniesLoader
      },
      {
        path: 'reviews/:userType/:userId',
        element: <Reviews />,
        loader: reviewsLoader
      },
      {
        path: 'createReview',
        element: <CreateReview />,
        loader: createReviewLoader
      },
      {
        path: 'promotion-requests',
        element: <PromotionRequests />,
        loader: PromotionRequestsLoader
      },
      {
        path: 'drop-requests',
        element: <DropRequests />,
        loader: dropRequestsLoader
      },
      {
        path: 'reports',
        element: <Reports />,
        loader: reportsLoader
      },
      {
        path: 'black-list',
        element: <BlackList />,
        loader: blackListLoader
      },
      {
        path: 'signout',
        element: <Logout/>
      }
    ],
  },
  {
    path: '/sign',
    element: <Sign/>,
    errorElement: <ErrorPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path:'/' }}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </CookiesProvider>
  </React.StrictMode>
);