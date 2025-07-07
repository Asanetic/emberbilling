
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SubscriptionplansRowMutations} from './SubscriptionplansRowMutations';

import listSubscriptionplansRowMutationsKeys from './SubscriptionplansMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddSubscriptionplans, UpdateSubscriptionplans } from './SubscriptionplansDbGateway';


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
      tbl: 'plans',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('plans', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('plans', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listSubscriptionplansRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SubscriptionplansRowMutations);

      return Response.json({
        status: 'success',
        message: 'Subscriptionplans data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Subscriptionplans failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SubscriptionplansRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SubscriptionplansRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SubscriptionplansRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SubscriptionplansRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SubscriptionplansRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SubscriptionplansFormAction = body.plans_mosy_action;
    const plans_uptoken_value = base64Decode(body.plans_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  plans inputs array ---// 
  const SubscriptionplansInputsArr = {

    "plan_id" : "?", 
    "plan_name" : "?", 
    "app_id" : "?", 
    "currency" : "?", 
    "plan_amount" : "?", 
    "plan_type" : "?", 
    "plan_period" : "?", 
    "active_status" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "remark" : "?", 

  };

  //--- End plans inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('plans',SubscriptionplansInputsArr, SubscriptionplansRequest, newId, authData)

    if (SubscriptionplansFormAction === "add_plans") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Subscriptionplans
      const result = await AddSubscriptionplans(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        plans_uptoken: result.record_id
      });
      
    }
    
    if (SubscriptionplansFormAction === "update_plans") {
      
      // update table Subscriptionplans
      const result = await UpdateSubscriptionplans(newId, mutatedDataArray, body, authData, `primkey='${plans_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        plans_uptoken: plans_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SubscriptionplansFormAction}`
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