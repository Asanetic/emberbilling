
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSubscriptionaccountsStateDefaults = {

  //state management for list page
  subscriptionaccountsListData : [],
  subscriptionaccountsListPageCount : 1,
  subscriptionaccountsLoading: true,  
  parentUseEffectKey : 'loadSubscriptionaccountsList',
  localEventSignature: 'loadSubscriptionaccountsList',
  subscriptionaccountsQuerySearchStr: '',

  
  //for profile page
  plansNode : {},
  subscriptionaccountsActionStatus : 'add_plans',
  paramsubscriptionaccountsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  subscriptionaccountsUptoken:'',
  subscriptionaccountsNode : {},
  
  //dataScript
  subscriptionaccountsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSubscriptionaccountsState(overrides = {}) {
  const combinedDefaults = { ...defaultSubscriptionaccountsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

