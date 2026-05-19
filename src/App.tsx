import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Snackbar } from "./utils/snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "@/contexts/ModalProvider";
import { FilterProvider } from "@/contexts/FilterProvider";

// All retry logic is handled in the axios interceptor (axiosSetup.ts).
// React Query retries are disabled globally — HTTP status codes are
// the axios layer's responsibility, not React Query's.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <FilterProvider>
          <Snackbar>
            <Outlet />
          </Snackbar>
        </FilterProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export { App };
