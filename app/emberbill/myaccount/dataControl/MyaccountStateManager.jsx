
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultMyaccountStateDefaults = {

  //state management for list page
  myaccountListData : [],
  myaccountListPageCount : 1,
  myaccountLoading: true,  
  parentUseEffectKey : 'loadMyaccountList',
  localEventSignature: 'loadMyaccountList',
  myaccountQuerySearchStr: '',

  
  //for profile page
  system_usersNode : {},
  myaccountActionStatus : 'add_system_users',
  parammyaccountUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  myaccountUptoken:'',
  myaccountNode : {},
  
  //dataScript
  myaccountCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useMyaccountState(overrides = {}) {
  const combinedDefaults = { ...defaultMyaccountStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

