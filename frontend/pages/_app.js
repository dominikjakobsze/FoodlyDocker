import "../styles/globals.css";
import LayoutContainer from "../components/ui/LayoutContainer";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { ModalMessageProvider } from "../context/ModalMessageContext";
import MessageModal from "../components/modals/MessageModal";
import { ActionMessageProvider } from "../context/ActionMessageContext";
import ActionMessage from "../components/modals/ActionMessage";

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActionMessageProvider>
          <ModalMessageProvider>
            <ActionMessage />
            <MessageModal />
            <LayoutContainer>
              <Component {...pageProps} />
            </LayoutContainer>
          </ModalMessageProvider>
        </ActionMessageProvider>
      </QueryClientProvider>
    </>
  );
}
