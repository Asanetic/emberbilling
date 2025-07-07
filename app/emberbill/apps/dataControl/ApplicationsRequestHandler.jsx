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
export async function insertApplications() {
 //console.log(`Form app_list insert sent `)

  return await mosyPostFormData({
    formId: 'app_list_profile_form',
    url: '/api/emberbill/apps/applications',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateApplications() {

  //console.log(`Form app_list update sent `)

  return await mosyPostFormData({
    formId: 'app_list_profile_form',
    url: '/api/emberbill/apps/applications',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateApplicationsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('app_list_mosy_action');
 
 //console.log(`Form app_list submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_app_list') {

      actionMessage ='Record added succesfully!';

      result = await insertApplications();
    }

    if (actionType === 'update_app_list') {

      actionMessage ='Record updated succesfully!';

      result = await updateApplications();
    }

    if (result?.status === 'success') {
      
      const app_listUptoken = btoa(result.app_list_uptoken || '');

      //set id key
      setters.setApplicationsUptoken(app_listUptoken);
      
      //update url with new app_listUptoken
      mosyUpdateUrlParam('app_list_uptoken', app_listUptoken)

      setters.setApplicationsActionStatus('update_app_list')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: app_listUptoken,
        actionName : actionType,
        actionType : 'app_list_form_submission'
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


export async function initApplicationsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Applications' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/emberbill/apps/applications',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initApplicationsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('apps Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching apps data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteApplications(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/emberbill/apps/delete',
        params: { 
          _app_list_delete_record: (token), 
          },
      });

      console.log('Token DeleteApplications '+token)
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


export async function getApplicationsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
     
  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qapp_list_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/emberbill/apps/applications',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qapp_list_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getApplicationsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('apps Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching apps data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadApplicationsListData(customQueryStr, setters) {

    const gftApplications = MosyFilterEngine('app_list', true);
    let finalFilterStr = btoa(gftApplications);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setApplicationsLoading(true);
    
    const applicationsListData = await getApplicationsListData(finalFilterStr);
    
    setters.setApplicationsLoading(false)
    setters.setApplicationsListData(applicationsListData?.data)

    setters.setApplicationsListPageCount(applicationsListData?.page_count)


    return applicationsListData

}
  
  
export async function applicationsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const applicationsTokenId = mosyUrlParam('app_list_uptoken');
    
    const deleteParam = mosyUrlParam('app_list_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedApplicationsToken = '0';
    if (applicationsTokenId) {
      
      decodedApplicationsToken = atob(applicationsTokenId); // Decode the record_id
      setters.setApplicationsUptoken(applicationsTokenId);
      setters.setApplicationsActionStatus('update_app_list');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawApplicationsQueryStr =`where primkey ='${decodedApplicationsToken}'`
    if(customQueryStr!='')
    {
      rawApplicationsQueryStr = customQueryStr
    }

    const profileDataRecord = await initApplicationsProfileData(rawApplicationsQueryStr)

    if(deleteParam){
      popDeleteDialog(applicationsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setApplicationsNode(finalProfileData)
    
    
}
  
  

export function InteprateApplicationsEvent(data) {
     
  //console.log('🎯 Applications Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_app_list){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setApplicationsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('app_list_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_app_list){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add app_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_app_list){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update app_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_app_list){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../apps/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteApplications(deleteToken).then(data=>{
  
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
       deleteUrlParam('app_list_delete');
        
    }
  
  });

}