import { toast, type ExternalToast } from 'sonner';
import { HttpError } from '../http/errors';

function isToastOptions(value: unknown): value is ExternalToast {
  return (
    !!value &&
    typeof value === 'object' &&
    ('description' in value || 'action' in value || 'duration' in value)
  );
}

function extractErrorDetails(error: HttpError) {
  const statusCode = error.status;
  const backendMessage = error.message?.trim();
  const fieldErrors = error.fieldErrors;

  const fieldErrorText = fieldErrors
    ? Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join(' | ')
    : '';

  if (fieldErrorText && backendMessage) {
    return `${backendMessage} | ${fieldErrorText}`;
  }

  if (fieldErrorText) {
    return fieldErrorText;
  }

  if (backendMessage && statusCode) {
    return `${statusCode} - ${backendMessage}`;
  }

  if (backendMessage) {
    return backendMessage;
  }

  if (statusCode) {
    return `Request failed with status ${statusCode}`;
  }

  return 'Something went wrong';
}

export const toaster = {
  success: (message: string, options?: ExternalToast) => toast.success(message, options),

  info: (message: string, options?: ExternalToast) => toast.info(message, options),

  warning: (message: string, options?: ExternalToast) => toast.warning(message, options),

  error: (message: string, second?: ExternalToast | HttpError) => {
    if (isToastOptions(second)) {
      return toast.error(message, second);
    }

    return toast.error(message, {
      description: second ? extractErrorDetails(second) : 'Something went wrong',
    });
  },

  message: toast,
};
