import Vue from 'vue';
import { creatorSdkService } from '@/services/creatorSdkService';

// Shared across the whole app: every component that calls useAuth() reads the
// same reactive object, so TopBar/MyArticles stay in sync once init() resolves.
const state = Vue.observable({
  email: '',
  name: '',
  ready: false,
});

let initPromise = null;
function init() {
  if (!initPromise) {
    initPromise = (async () => {
      const inCreator = await creatorSdkService.waitForSdk();
      if (inCreator) {
        const params = await creatorSdkService.getInitParams();
        state.email = (params && params.loginUser) || '';
        state.name = state.email;
      } else {
        state.email = 'alexis@zenatta.com';
        state.name = 'Alexis Alvarado';
      }
      state.ready = true;
    })();
  }
  return initPromise;
}

export function useAuth() {
  return { state, init };
}
