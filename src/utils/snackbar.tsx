import { FC, ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';

interface SnackbarProviderConfigProps {
  children: ReactNode;
}

const Snackbar: FC<SnackbarProviderConfigProps> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {children}
    </SnackbarProvider>
  );
};

export { Snackbar };
