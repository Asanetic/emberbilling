
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SubscriptionaccountsRowMutations} from './SubscriptionaccountsRowMutations';

import listSubscriptionaccountsRowMutationsKeys from './SubscriptionaccountsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddSubscriptionaccounts, UpdateSubscriptionaccounts } from './SubscriptionaccountsDbGateway';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let requestedMutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        requestedMutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'billing_account',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('billing_account', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('billing_account', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listSubscriptionaccountsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SubscriptionaccountsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Subscriptionaccounts data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Subscriptionaccounts failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SubscriptionaccountsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SubscriptionaccountsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SubscriptionaccountsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SubscriptionaccountsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SubscriptionaccountsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SubscriptionaccountsFormAction = body.billing_account_mosy_action;
    const billing_account_uptoken_value = base64Decode(body.billing_account_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  billing_account inputs array ---// 
  const SubscriptionaccountsInputsArr = {

    "account_name" : "?", 
    "account_no" : "?", 
    "account_tel" : "?", 
    "account_email" : "?", 
    "plan_id" : "?", 
    "plan_name" : "?", 
    "plan_amount" : "?", 
    "plan_type" : "?", 
    "plan_period" : "?", 
    "expiring_on" : "?", 
    "active_status" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "app_id" : "?", 
    "date_created" : "?", 
    "previous_plan" : "?", 

  };

  //--- End billing_account inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('billing_account',SubscriptionaccountsInputsArr, SubscriptionaccountsRequest, newId, authData)

    if (SubscriptionaccountsFormAction === "add_billing_account") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Subscriptionaccounts
      const result = await AddSubscriptionaccounts(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        billing_account_uptoken: result.record_id
      });
      
    }
    
    if (SubscriptionaccountsFormAction === "update_billing_account") {
      
      // update table Subscriptionaccounts
      const result = await UpdateSubscriptionaccounts(newId, mutatedDataArray, body, authData, `primkey='${billing_account_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        billing_account_uptoken: billing_account_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SubscriptionaccountsFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}