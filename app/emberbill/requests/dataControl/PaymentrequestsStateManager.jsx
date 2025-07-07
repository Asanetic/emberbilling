
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPaymentrequestsStateDefaults = {

  //state management for list page
  paymentrequestsListData : [],
  paymentrequestsListPageCount : 1,
  paymentrequestsLoading: true,  
  parentUseEffectKey : 'loadPaymentrequestsList',
  localEventSignature: 'loadPaymentrequestsList',
  paymentrequestsQuerySearchStr: '',

  
  //for profile page
  checkout_ordersNode : {},
  paymentrequestsActionStatus : 'add_checkout_orders',
  parampaymentrequestsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  paymentrequestsUptoken:'',
  paymentrequestsNode : {},
  
  //dataScript
  paymentrequestsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePaymentrequestsState(overrides = {}) {
  const combinedDefaults = { ...defaultPaymentrequestsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

