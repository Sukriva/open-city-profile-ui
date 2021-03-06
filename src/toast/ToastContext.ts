import { createContext } from 'react';

import { LaxToast } from './types';

export interface ToastContextType {
  createToast: (toast?: LaxToast) => string;
  hideToast: (toastId: string) => void;
  deleteToast: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  createToast: (toast?: LaxToast): string => '',
  hideToast: (toastId: string) => {
    // pass
  },
  deleteToast: (toastId: string) => {
    // pass
  },
});

export default ToastContext;
