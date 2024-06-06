// assets
import { IconKey,IconBuildingSkyscraper} from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconBuildingSkyscraper

};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const auth = {
  id: 'auth',
  title: 'authentication',
  caption: '',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
    
      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    },
  ]
};

export default auth;
