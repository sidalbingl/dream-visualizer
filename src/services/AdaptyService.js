let adapty = null;
try {
  const mod = require('react-native-adapty');
  adapty = mod?.adapty || null;
} catch (e) {
  adapty = null;
}
let AdaptyUI = null;
try {
  // @adapty/react-native-ui exports createPaywallView
  AdaptyUI = require('@adapty/react-native-ui');
} catch (e) {
  AdaptyUI = null;
}
import AdaptyConstans from '../../AdaptyConstans';

class AdaptyService {
  static async activate() {
    try {
      if (!adapty) { console.warn('Adapty module not installed. Skipping activation.'); return; }
      if (!AdaptyConstans?.ADAPTY_API_KEY) { console.warn('Adapty API key is missing in AdaptyConstans.js'); return; }
      try { await adapty.setLogLevel('verbose'); } catch (e) {}
      await adapty.activate(AdaptyConstans.ADAPTY_API_KEY, {
        lockMethodsUntilReady: true,
        enableUsageLogs: true,
      });
    } catch (error) { console.warn('Adapty activate error', error); }
  }

  static async getProfile() {
    try {
      if (!adapty || typeof adapty.getProfile !== 'function') { console.warn('Adapty.getProfile unavailable.'); return null; }
      return await adapty.getProfile();
    } catch (error) { console.warn('Adapty getProfile error', error); return null; }
  }

  static async restorePurchases() {
    try {
      if (!adapty || typeof adapty.restorePurchases !== 'function') { console.warn('Adapty.restorePurchases unavailable.'); return null; }
      return await adapty.restorePurchases();
    } catch (error) { console.warn('Adapty restorePurchases error', error); return null; }
  }

  static async getPaywall() {
    try {
      if (!adapty || typeof adapty.getPaywall !== 'function') { console.warn('Adapty.getPaywall unavailable.'); return null; }
      return await adapty.getPaywall(AdaptyConstans.PLACEMENT_ID);
    } catch (error) { console.warn('Adapty getPaywall error', error); return null; }
  }

  static async getPaywallProducts(paywall) {
    try {
      if (!adapty || typeof adapty.getPaywallProducts !== 'function') { console.warn('Adapty.getPaywallProducts unavailable.'); return []; }
      if (!paywall) return [];
      return await adapty.getPaywallProducts(paywall);
    } catch (error) { console.warn('Adapty getPaywallProducts error', error); return []; }
  }

  static async makePurchase(product) {
    try {
      if (!adapty || typeof adapty.makePurchase !== 'function') { console.warn('Adapty.makePurchase unavailable.'); return null; }
      if (!product) return null;
      return await adapty.makePurchase(product);
    } catch (error) { console.warn('Adapty makePurchase error', error); return null; }
  }

  static async presentNoCodePaywall() {
    try {
      if (!adapty) { console.warn('Adapty is not available.'); return { presented: false }; }
      if (!AdaptyUI || typeof AdaptyUI.createPaywallView !== 'function') {
        console.warn('AdaptyUI not available. Falling back.');
        return { presented: false };
      }
      const paywall = await adapty.getPaywall(AdaptyConstans.PLACEMENT_ID);
      if (!paywall) { console.warn('No paywall returned for placement:', AdaptyConstans.PLACEMENT_ID); return { presented: false }; }

      const controller = await AdaptyUI.createPaywallView(paywall, { prefetchProducts: true });

      // optional: ensure default handlers close the view on success/restore/close
      if (controller?.registerEventHandlers) {
        controller.registerEventHandlers();
      }

      await controller.present();
      return { presented: true };
    } catch (error) {
      console.warn('presentNoCodePaywall error', error);
      return { presented: false, error };
    }
  }
}

export default AdaptyService;
