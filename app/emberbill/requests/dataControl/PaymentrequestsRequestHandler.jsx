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
export async function insertPaymentrequests() {
 //console.log(`Form checkout_orders insert sent `)

  return await mosyPostFormData({
    formId: 'checkout_orders_profile_form',
    url: '/api/emberbill/requests/paymentrequests',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updatePaymentrequests() {

  //console.log(`Form checkout_orders update sent `)

  return await mosyPostFormData({
    formId: 'checkout_orders_profile_form',
    url: '/api/emberbill/requests/paymentrequests',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function intepratePaymentrequestsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('checkout_orders_mosy_action');
 
 //console.log(`Form checkout_orders submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_checkout_orders') {

      actionMessage ='Record added succesfully!';

      result = await insertPaymentrequests();
    }

    if (actionType === 'update_checkout_orders') {

      actionMessage ='Record updated succesfully!';

      result = await updatePaymentrequests();
    }

    if (result?.status === 'success') {
      
      const checkout_ordersUptoken = btoa(result.checkout_orders_uptoken || '');

      //set id key
      setters.setPaymentrequestsUptoken(checkout_ordersUptoken);
      
      //update url with new checkout_ordersUptoken
      mosyUpdateUrlParam('checkout_orders_uptoken', checkout_ordersUptoken)

      setters.setPaymentrequestsActionStatus('update_checkout_orders')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: checkout_ordersUptoken,
        actionName : actionType,
        actionType : 'checkout_orders_form_submission'
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


export async function initPaymentrequestsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Payment requests' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/emberbill/requests/paymentrequests',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initPaymentrequestsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('requests Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching requests data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeletePaymentrequests(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/emberbill/requests/delete',
        params: { 
          _checkout_orders_delete_record: (token), 
          },
      });

      console.log('Token DeletePaymentrequests '+token)
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


export async function getPaymentrequestsListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qcheckout_orders_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/emberbill/requests/paymentrequests',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qcheckout_orders_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getPaymentrequestsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('requests Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching requests data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadPaymentrequestsListData(customQueryStr, setters) {

    const gftPaymentrequests = MosyFilterEngine('checkout_orders', true);
    let finalFilterStr = btoa(gftPaymentrequests);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setPaymentrequestsLoading(true);
    
    const paymentrequestsListData = await getPaymentrequestsListData(finalFilterStr);
    
    setters.setPaymentrequestsLoading(false)
    setters.setPaymentrequestsListData(paymentrequestsListData?.data)

    setters.setPaymentrequestsListPageCount(paymentrequestsListData?.page_count)


    return paymentrequestsListData

}
  
  
export async function paymentrequestsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const paymentrequestsTokenId = mosyUrlParam('checkout_orders_uptoken');
    
    const deleteParam = mosyUrlParam('checkout_orders_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedPaymentrequestsToken = '0';
    if (paymentrequestsTokenId) {
      
      decodedPaymentrequestsToken = atob(paymentrequestsTokenId); // Decode the record_id
      setters.setPaymentrequestsUptoken(paymentrequestsTokenId);
      setters.setPaymentrequestsActionStatus('update_checkout_orders');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawPaymentrequestsQueryStr =`where primkey ='${decodedPaymentrequestsToken}'`
    if(customQueryStr!='')
    {
      rawPaymentrequestsQueryStr = customQueryStr
    }

    const profileDataRecord = await initPaymentrequestsProfileData(rawPaymentrequestsQueryStr)

    if(deleteParam){
      popDeleteDialog(paymentrequestsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setPaymentrequestsNode(finalProfileData)
    
    
}
  
  

export function IntepratePaymentrequestsEvent(data) {
     
  //console.log('🎯 Paymentrequests Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_checkout_orders){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setPaymentrequestsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('checkout_orders_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_checkout_orders){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add checkout_orders `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_checkout_orders){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update checkout_orders `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_checkout_orders){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../requests/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeletePaymentrequests(deleteToken).then(data=>{
  
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
       deleteUrlParam('checkout_orders_delete');
        
    }
  
  });

}