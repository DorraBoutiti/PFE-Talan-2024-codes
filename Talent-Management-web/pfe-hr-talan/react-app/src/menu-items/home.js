// assets
import { IconHome,IconDashboard,IconKey,IconBrandOpenai,IconBuildingSkyscraper,IconMessageChatbot,IconDatabase} from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconBuildingSkyscraper,
  IconMessageChatbot,
  IconDatabase,
  IconBrandOpenai,
  IconDashboard,
  IconHome
};


// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const home = {
  id: 'menu',
  title: 'Menu',
  caption: '',
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: true
      
    },    
    
  ]
};

export default home;
