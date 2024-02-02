import { useState, useContext, createContext, ReactNode, useMemo, useCallback } from 'react';
import { ToastProps } from '../utils/types';

export type SnackStackContextProps = {
  toastsPack: ToastProps[];
  setToastsPack: (toasts: ToastProps[]) => void;
  addToast: (toast: ToastProps) => void;
  removeToast: (key: ToastProps['key']) => void;
};

const SnackStackContext = createContext<SnackStackContextProps>({
  toastsPack: [],
  setToastsPack: () => {},
  addToast: () => {},
  removeToast: () => {},
});

function SnackStackProvider({ children }: { children: ReactNode }) {
  const [toastsPack, setToastsPack] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (toast: ToastProps) => {
      const key = toast.key || Date.now();

      // Prevent duplicated toasts
      if (toastsPack.find((duplicateToast) => duplicateToast.key === key)) {
        return;
      }
      setToastsPack((prevToastsPack) => [{ ...toast, key }, ...prevToastsPack]);
    },
    [toastsPack]
  );

  const removeToast = useCallback((key: ToastProps['key']) => {
    setToastsPack((prevToastsPack) => prevToastsPack.filter((toast) => toast.key !== key));
  }, []);

  const contextValue = useMemo(
    () => ({
      toastsPack,
      setToastsPack,
      addToast,
      removeToast,
    }),
    [toastsPack, setToastsPack, addToast, removeToast]
  );

  return <SnackStackContext.Provider value={contextValue}>{children}</SnackStackContext.Provider>;
}

export const useSnackStack = () => useContext(SnackStackContext);

export default SnackStackProvider;
