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
export async function insertSubscriptionplans() {
 //console.log(`Form plans insert sent `)

  return await mosyPostFormData({
    formId: 'plans_profile_form',
    url: '/api/emberbill/plans/subscriptionplans',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSubscriptionplans() {

  //console.log(`Form plans update sent `)

  return await mosyPostFormData({
    formId: 'plans_profile_form',
    url: '/api/emberbill/plans/subscriptionplans',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSubscriptionplansFormAction(e, setters) {
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

      result = await insertSubscriptionplans();
    }

    if (actionType === 'update_plans') {

      actionMessage ='Record updated succesfully!';

      result = await updateSubscriptionplans();
    }

    if (result?.status === 'success') {
      
      const plansUptoken = btoa(result.plans_uptoken || '');

      //set id key
      setters.setSubscriptionplansUptoken(plansUptoken);
      
      //update url with new plansUptoken
      mosyUpdateUrlParam('plans_uptoken', plansUptoken)

      setters.setSubscriptionplansActionStatus('update_plans')
    
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


export async function initSubscriptionplansProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _app_list_app_name_app_id : [],

  }
  

  MosyNotify({message : 'Refreshing Subscription plans' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/emberbill/plans/subscriptionplans',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSubscriptionplansProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('plans Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching plans data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSubscriptionplans(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/emberbill/plans/delete',
        params: { 
          _plans_delete_record: (token), 
          },
      });

      console.log('Token DeleteSubscriptionplans '+token)
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


export async function getSubscriptionplansListData(qstr = "") {
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
      endpoint: '/api/emberbill/plans/subscriptionplans',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qplans_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSubscriptionplansListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('plans Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching plans data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSubscriptionplansListData(customQueryStr, setters) {

    const gftSubscriptionplans = MosyFilterEngine('plans', true);
    let finalFilterStr = btoa(gftSubscriptionplans);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSubscriptionplansLoading(true);
    
    const subscriptionplansListData = await getSubscriptionplansListData(finalFilterStr);
    
    setters.setSubscriptionplansLoading(false)
    setters.setSubscriptionplansListData(subscriptionplansListData?.data)

    setters.setSubscriptionplansListPageCount(subscriptionplansListData?.page_count)


    return subscriptionplansListData

}
  
  
export async function subscriptionplansProfileData(customQueryStr, setters, router, customProfileData={}) {

    const subscriptionplansTokenId = mosyUrlParam('plans_uptoken');
    
    const deleteParam = mosyUrlParam('plans_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSubscriptionplansToken = '0';
    if (subscriptionplansTokenId) {
      
      decodedSubscriptionplansToken = atob(subscriptionplansTokenId); // Decode the record_id
      setters.setSubscriptionplansUptoken(subscriptionplansTokenId);
      setters.setSubscriptionplansActionStatus('update_plans');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSubscriptionplansQueryStr =`where primkey ='${decodedSubscriptionplansToken}'`
    if(customQueryStr!='')
    {
      // if no plans_uptoken set , use customQueryStr
      if (!subscriptionplansTokenId) {
       rawSubscriptionplansQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSubscriptionplansProfileData(rawSubscriptionplansQueryStr)

    if(deleteParam){
      popDeleteDialog(subscriptionplansTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSubscriptionplansNode(finalProfileData)
    
    
}
  
  

export function InteprateSubscriptionplansEvent(data) {
     
  //console.log('🎯 Subscriptionplans Child gave us:', data);

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

    parentSetter?.setSubscriptionplansCustomProfileQuery(data?.qstr)

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


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../plans/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSubscriptionplans(deleteToken).then(data=>{
  
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