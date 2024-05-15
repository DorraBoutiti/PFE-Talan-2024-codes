import { Helmet } from 'react-helmet-async';

import { ChatbotView } from 'src/sections/chatbot';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Chatbot </title>
      </Helmet>

      <ChatbotView />
    </>
  );
}
