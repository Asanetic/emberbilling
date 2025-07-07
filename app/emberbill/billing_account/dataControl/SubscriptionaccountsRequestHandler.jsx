'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';


//insert data
export async function insertSubscriptionaccounts() {
 //console.log(`Form plans insert sent `)

  return await mosyPostFormData({
    formId: 'plans_profile_form',
    url: '/api/emberbill/billing_account/subscriptionaccounts',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSubscriptionaccounts() {

  //console.log(`Form plans update sent `)

  return await mosyPostFormData({
    formId: 'plans_profile_form',
    url: '/api/emberbill/billing_account/subscriptionaccounts',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSubscriptionaccountsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('plans_mosy_action');
 
 //console.log(`Form plans submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_plans') {

      actionMessage ='Record added succesfully!';

      result = await insertSubscriptionaccounts();
    }

    if (actionType === 'update_plans') {

      actionMessage ='Record updated succesfully!';

      result = await updateSubscriptionaccounts();
    }

    if (result?.status === 'success') {
      
      const plansUptoken = btoa(result.plans_uptoken || '');

      //set id key
      setters.setSubscriptionaccountsUptoken(plansUptoken);
      
      //update url with new plansUptoken
      mosyUpdateUrlParam('plans_uptoken', plansUptoken)

      setters.setSubscriptionaccountsActionStatus('update_plans')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: plansUptoken,
        actionName : actionType,
        actionType : 'plans_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initSubscriptionaccountsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _app_list_app_name_app_id : [],

  }
  

  MosyNotify({message : 'Refreshing Subscription accounts' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/emberbill/billing_account/subscriptionaccounts',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSubscriptionaccountsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('billing_account Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching billing_account data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSubscriptionaccounts(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/emberbill/billing_account/delete',
        params: { 
          _plans_delete_record: (token), 
          },
      });

      console.log('Token DeleteSubscriptionaccounts '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // ✅ Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getSubscriptionaccountsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _app_list_app_name_app_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qplans_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/emberbill/billing_account/subscriptionaccounts',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qplans_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSubscriptionaccountsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('billing_account Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching billing_account data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSubscriptionaccountsListData(customQueryStr, setters) {

    const gftSubscriptionaccounts = MosyFilterEngine('plans', true);
    let finalFilterStr = btoa(gftSubscriptionaccounts);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSubscriptionaccountsLoading(true);
    
    const subscriptionaccountsListData = await getSubscriptionaccountsListData(finalFilterStr);
    
    setters.setSubscriptionaccountsLoading(false)
    setters.setSubscriptionaccountsListData(subscriptionaccountsListData?.data)

    setters.setSubscriptionaccountsListPageCount(subscriptionaccountsListData?.page_count)


    return subscriptionaccountsListData

}
  
  
export async function subscriptionaccountsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const subscriptionaccountsTokenId = mosyUrlParam('plans_uptoken');
    
    const deleteParam = mosyUrlParam('plans_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSubscriptionaccountsToken = '0';
    if (subscriptionaccountsTokenId) {
      
      decodedSubscriptionaccountsToken = atob(subscriptionaccountsTokenId); // Decode the record_id
      setters.setSubscriptionaccountsUptoken(subscriptionaccountsTokenId);
      setters.setSubscriptionaccountsActionStatus('update_plans');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSubscriptionaccountsQueryStr =`where primkey ='${decodedSubscriptionaccountsToken}'`
    if(customQueryStr!='')
    {
      rawSubscriptionaccountsQueryStr = customQueryStr
    }

    const profileDataRecord = await initSubscriptionaccountsProfileData(rawSubscriptionaccountsQueryStr)

    if(deleteParam){
      popDeleteDialog(subscriptionaccountsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSubscriptionaccountsNode(finalProfileData)
    
    
}
  
  

export function InteprateSubscriptionaccountsEvent(data) {
     
  //console.log('🎯 Subscriptionaccounts Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_plans){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSubscriptionaccountsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('plans_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_plans){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add plans `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_plans){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update plans `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_plans){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../billing_account/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSubscriptionaccounts(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('plans_delete');
        
    }
  
  });

}