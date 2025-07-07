
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSubscriptionplansStateDefaults = {

  //state management for list page
  subscriptionplansListData : [],
  subscriptionplansListPageCount : 1,
  subscriptionplansLoading: true,  
  parentUseEffectKey : 'loadSubscriptionplansList',
  localEventSignature: 'loadSubscriptionplansList',
  subscriptionplansQuerySearchStr: '',

  
  //for profile page
  plansNode : {},
  subscriptionplansActionStatus : 'add_plans',
  paramsubscriptionplansUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  subscriptionplansUptoken:'',
  subscriptionplansNode : {},
  
  //dataScript
  subscriptionplansCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSubscriptionplansState(overrides = {}) {
  const combinedDefaults = { ...defaultSubscriptionplansStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

