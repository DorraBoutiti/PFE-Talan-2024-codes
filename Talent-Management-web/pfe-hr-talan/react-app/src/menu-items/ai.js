// assets

import { IconCompass,IconPresentation,IconRobot,IconHome,IconDashboard,IconKey,IconBrandOpenai,IconBuildingSkyscraper,IconMessageChatbot,IconDatabase} from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconBuildingSkyscraper,
  IconMessageChatbot,
  IconDatabase,
  IconBrandOpenai,
  IconDashboard,
  IconHome,
  IconRobot,
  IconPresentation,
  IconCompass
};


// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const ai = {
  id: 'ai',
  title: 'AI Assistant',
  caption: '',
  type: 'group',
  children: [
       
    {
      id: 'talbot',
      title: 'TALBOT Assistant',
      type: 'collapse',
      icon: icons.IconMessageChatbot,

      children: [
        
        /*{
          id: 'talbot-ai',
          title: 'AI Assistant',
          type: 'item',
          icon: icons.IconRobot,
          url: '/talbot/talbot-ai',
          breadcrumbs: true
        },*/
        {
          id: 'talbot-recommendation',
          title: 'Recommendation',
          type: 'item',
          icon: icons.IconPresentation,
          url: '/talbot/talbot-recommendation',
          breadcrumbs: true
        },
        {
          id: 'talbot-data',
          title: 'Chat With Data',
          type: 'item',
          icon: icons.IconDatabase,
          url: '/talbot/talbot-data',
          breadcrumbs: true
        },
        {
          id: 'talbot-matching',
          title: 'Matching',
          type: 'item',
          icon: icons.IconCompass,
          url: '/talbot/talbot-matching',
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default ai;
