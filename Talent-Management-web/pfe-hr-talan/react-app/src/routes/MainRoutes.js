import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'utils/ProtectedRoute';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/talbot/about')));
const Comp = Loadable(lazy(() => import('views/dashboard/Default')));
const General = Loadable(lazy(() => import('views/bi/general')));
// sample page routing
const DepRh = Loadable(lazy(() => import('views/bi/rh')));
const DepManagement = Loadable(lazy(() => import('views/bi/management')));
const DepProd = Loadable(lazy(() => import('views/bi/prod')));
const DepSupport = Loadable(lazy(() => import('views/bi/support')));
const DepHorsProd = Loadable(lazy(() => import('views/bi/horsprod')));

const Chat = Loadable(lazy(() => import('views/talbot/chat')));
const ChatD = Loadable(lazy(() => import('views/talbot/chatD')));
const ChatR = Loadable(lazy(() => import('views/talbot/chatRe')));
const Matching = Loadable(lazy(() => import('views/talbot/matching')));
const Profile = Loadable(lazy(() => import('layout/MainLayout/Header/ProfileSection/profile')));
const Unauthorized = Loadable(lazy(() => import('views/bi/Unauthorized')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute component={MainLayout} />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'pages',
      children: [
        {
          path: 'profile',
          element: <Profile />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'bi',
      children: [
        {
          path: 'bi-comp',
          element: <Comp />
        }
      ]
    },
    {
      path: 'bi',
      children: [
        {
          path: 'bi-gen',
          element: <General />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-rh',
          element: <DepRh />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-management',
          element: <DepManagement />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-production',
          element: <DepProd />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-support',
          element: <DepSupport />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-hors-prod',
          element: <DepHorsProd />
        }
      ]
    },
    {
      path: 'dep',
      children: [
        {
          path: 'dep-unauthorized',
          element: <Unauthorized />
        }
      ]
    },
    
    {
      path: 'talbot',
      children: [
        {
          path: 'talbot-ai',
          element: <Chat />
        }
      ]
    },
    {
      path: 'talbot',
      children: [
        {
          path: 'talbot-data',
          element: <ChatD />
        }
      ]
    },
    {
      path: 'talbot',
      children: [
        {
          path: 'talbot-recommendation',
          element: <ChatR />
        }
      ]
    },
    {
      path: 'talbot',
      children: [
        {
          path: 'talbot-matching',
          element: <Matching />
        }
      ]
    }
    
  ]
};

export default MainRoutes;
