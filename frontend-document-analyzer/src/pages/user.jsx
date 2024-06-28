import { Helmet } from 'react-helmet-async';

import { account } from 'src/_mock/account';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const name = account.displayName;
  return (
    <>
      <Helmet>
        <title> {name} documents </title>
      </Helmet>

      <UserView />
    </>
  );
}
