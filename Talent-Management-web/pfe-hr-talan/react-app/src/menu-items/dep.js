// assets
import { IconGitCompare,IconPresentationAnalytics,IconHome,IconDashboard,IconKey,IconBrandOpenai,IconBuildingSkyscraper,IconMessageChatbot,IconDatabase} from '@tabler/icons-react';


// constant
const icons = {
  IconKey,
  IconBuildingSkyscraper,
  IconMessageChatbot,
  IconDatabase,
  IconBrandOpenai,
  IconDashboard,
  IconHome,
  IconPresentationAnalytics,
  IconGitCompare
};



const dep = {
    id: 'menu',
    title: 'Analytics',
    caption: '',
    type: 'group',
    
    children: [
        {           
            id: 'bi-gen',
            title: 'General',
            type: 'item',
            url: '/bi/bi-gen',
            icon: icons.IconBuildingSkyscraper,
            breadcrumbs: true     
        },  
        {                
            id: 'bi-comp',
            title: 'Skills comparator',
            type: 'item',
            url: '/bi/bi-comp',
            icon: icons.IconGitCompare,
            breadcrumbs: true
        },    
        {
            id: 'dep',
            title: 'Departments',
            type: 'collapse',
            icon: icons.IconDashboard,
      
            children: [
             
              {
                id: 'dep-rh',
                title: 'HR',
                type: 'item',
                url: '/dep/dep-rh',
                breadcrumbs: true
                
              },
              {
                id: 'dep-management',
                title: 'Management',
                type: 'item',
                url: '/dep/dep-management',
                breadcrumbs: true
              },
              {
                id: 'dep-production',
                title: 'Production',
                type: 'item',
                url: '/dep/dep-production',
                breadcrumbs: true
              },
              {
                id: 'dep-support',
                title: 'Support Production',
                type: 'item',
                url: '/dep/dep-support',
                breadcrumbs: true
              },
              {
                id: 'dep-hors-prod',
                title: 'Hors Production',
                type: 'item',
                url: '/dep/dep-hors-prod',
                breadcrumbs: true
              }
            ]
          }
        ]
      };
      
      export default dep;
      