import { useCallback } from 'react';
import { queryClient } from '../providers/QueryProvider';

// Global registry for custom busy states (e.g. multi-step wizards, file uploads)
const activeBusyRegistrations = new Set<string>();

/**
 * Register a specific component or workflow as busy (e.g., during active uploads or multi-step wizard)
 */
export const registerBusyState = (key: string, isBusy: boolean) => {
  if (isBusy) {
    activeBusyRegistrations.add(key);
  } else {
    activeBusyRegistrations.delete(key);
  }
};

/**
 * Checks whether the user is actively working on the page.
 * Returns true if:
 * 1. User has an active input/textarea/select focused.
 * 2. Any form contains unsubmitted text or inputs.
 * 3. Any React Query mutation is in progress (isMutating > 0).
 * 4. Any custom component has registered a busy state.
 */
export const checkIsUserBusy = (): boolean => {
  // 1. Check custom registered busy flags
  if (activeBusyRegistrations.size > 0) {
    return true;
  }

  // 2. Check if any network mutation is actively processing
  try {
    if (queryClient.isMutating() > 0) {
      return true;
    }
  } catch {
    // queryClient might not be initialized in edge cases
  }

  // 3. Check active focused DOM element
  const activeEl = document.activeElement;
  if (activeEl) {
    const tagName = activeEl.tagName.toLowerCase();
    if (
      tagName === 'input' || 
      tagName === 'textarea' || 
      tagName === 'select' || 
      (activeEl as HTMLElement).isContentEditable
    ) {
      // If user is focused on a search input that is empty, don't consider them stuck
      if (tagName === 'input') {
        const input = activeEl as HTMLInputElement;
        const type = input.type.toLowerCase();
        if ((type === 'text' || type === 'search' || type === 'email' || type === 'password') && input.value.trim().length > 0) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  // 4. Scan any form on the page to see if user has entered non-empty unsubmitted text
  const forms = document.querySelectorAll('form');
  for (const form of forms) {
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    for (const input of inputs) {
      // Skip hidden, submit, button, search inputs
      const type = input.getAttribute('type') || '';
      if (['hidden', 'submit', 'button', 'search'].includes(type.toLowerCase())) continue;
      
      if (input.value && input.value.trim().length > 0) {
        // User has entered values in an active form
        return true;
      }
    }
  }

  return false;
};

/**
 * Hook to access and manage user activity guard in React components
 */
export const useUserActivityGuard = () => {
  const isUserBusy = useCallback(() => {
    return checkIsUserBusy();
  }, []);

  const setBusy = useCallback((key: string, isBusy: boolean) => {
    registerBusyState(key, isBusy);
  }, []);

  return {
    isUserBusy,
    setBusy,
  };
};
