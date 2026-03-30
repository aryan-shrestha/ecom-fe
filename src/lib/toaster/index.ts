import { toast, type ExternalToast } from 'sonner';

//defines error from backend look alike
type ApiError = {
  statusCode?: number;
  statusText?: string;
  message?: string;
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      message?: string;
    };
  };
};

function isToastOptions(obj: any): obj is ExternalToast {
  // crude but effective check
  return obj && ('description' in obj || 'action' in obj || 'duration' in obj);
}

function extractErrorDetails(error: ApiError) {
  const statusCode = error?.statusCode ?? error?.response?.status;
  const statusText = error?.statusText ?? error?.response?.statusText;
  const backendMessage = error?.response?.data?.message ?? error?.message;

  const statusLine = [statusCode, statusText].filter(Boolean).join(' - ');

  return statusLine || backendMessage;
}

export const toaster = {
  success: (message: string, options?: ExternalToast) => toast.success(message, options),

  info: (message: string, options?: ExternalToast) => toast.info(message, options),

  warning: (message: string, options?: ExternalToast) => toast.warning(message, options),

  error: (message: string, second?: ExternalToast | ApiError) => {
    // If it's already toast options → just pass through
    if (isToastOptions(second)) {
      return toast.error(message, second);
    }

    // Otherwise treat it as an error object
    const description = second ? extractErrorDetails(second) : undefined;

    return toast.error(message, {
      description: description || 'Something went wrong',
    });
  },

  message: toast,
};
