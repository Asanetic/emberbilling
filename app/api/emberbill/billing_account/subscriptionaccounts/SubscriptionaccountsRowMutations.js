
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Subscriptionaccounts 
export const SubscriptionaccountsRowMutations = {

  //dope  _app_list_app_name_app_id column to the response
  _app_list_app_name_app_id : async (row)=>{

    const data_res = await mosyQddata("app_list", "app_id", row.app_id);
    return data_res?.app_name ?? row.app_id;

  }
}
