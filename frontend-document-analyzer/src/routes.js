import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";

import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import FileUpload from "layouts/authentication/components/upload";

const routes = [
  //{ type: "title", title: "Pre-Employment Information", key: "pre-employment" },
  {
    type: "collapse",
    name: "Assign Fuzzy onBoarding team",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Review employee details",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Select employee region and team",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Profile/>,
    noCollapse: true,
  },
  { type: "title", title: "Employee prepartion", key: "employee-prepartion" },
  {
    type: "collapse",
    name: "Send non-Disclosure Agreement",
    key: "agreement",
    route: "/agreement",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Request email and equipment selection",
    key: "email",
    route: "/email",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "New employee selects equipment",
    key: "selects",
    route: "/selects",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Prepare new employee equipment",
    key: "equipment",
    route: "/equipment",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Approve onboarding preparation",
    key: "Approve",
    route: "/approve",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  { type: "title", title: "Employee onboarding", key: "employee-onboarding" },
  {
    type: "collapse",
    name: "Intro to Fuzzy Tunisia",
    key: "Intro",
    route: "/intro",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Send onboarding message to teams",
    key: "Send",
    route: "/send",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },

  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <CustomerSupport size="12px" />,
  //   component: <Profile />,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/landing",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/upload/:userName/:id", // Include parameters in the route
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;
