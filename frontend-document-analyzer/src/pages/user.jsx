import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const name = 'John Doe';
  return (
    <>
      <Helmet>
        <title> {name} documents </title>
      </Helmet>

      <UserView />
    </>
  );
}
