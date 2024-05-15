import { Helmet } from 'react-helmet-async';

import { AddCandidat } from 'src/sections/addCandidat';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> New candidat </title>
      </Helmet>

      <AddCandidat />
    </>
  );
}
