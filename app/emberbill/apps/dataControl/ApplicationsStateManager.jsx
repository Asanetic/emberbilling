
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultApplicationsStateDefaults = {

  //state management for list page
  applicationsListData : [],
  applicationsListPageCount : 1,
  applicationsLoading: true,  
  parentUseEffectKey : 'loadApplicationsList',
  localEventSignature: 'loadApplicationsList',
  applicationsQuerySearchStr: '',

  
  //for profile page
  app_listNode : {},
  applicationsActionStatus : 'add_app_list',
  paramapplicationsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  applicationsUptoken:'',
  applicationsNode : {},
  
  //dataScript
  applicationsCustomProfileQuery : '',
  subscriptionplansCustomProfileQuery : ``,
  
  // ... other base defaults
};

export function useApplicationsState(overrides = {}) {
  const combinedDefaults = { ...defaultApplicationsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

