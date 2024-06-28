import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const candidateId = sessionStorage.getItem("candidateId");
const navConfig = [
  {
    title: 'dashboard',
    path: `/${candidateId}/landing`,  
    icon: icon('ic_user'),
  },
  {
    title: 'Documents',
    path: `/${candidateId}/documents`,
    icon: icon('ic_doc'),
  },
  
];

export default navConfig;
