
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {AppplansRowMutations} from './AppplansRowMutations';

import listAppplansRowMutationsKeys from './AppplansMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddAppplans, UpdateAppplans } from './AppplansDbGateway';


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
    const mutationsObj = isEmpty(requestedMutationsObj) ? listAppplansRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, AppplansRowMutations);

      return Response.json({
        status: 'success',
        message: 'Appplans data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Appplans failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(AppplansRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AppplansRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AppplansRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AppplansRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AppplansRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const AppplansFormAction = body.plans_mosy_action;
    const plans_uptoken_value = base64Decode(body.plans_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  plans inputs array ---// 
  const AppplansInputsArr = {

    "plan_id" : "?", 
    "plan_name" : "?", 
    "plan_amount" : "?", 
    "plan_type" : "?", 
    "plan_period" : "?", 
    "active_status" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "remark" : "?", 
    "app_id" : "?", 
    "currency" : "?", 

  };

  //--- End plans inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('plans',AppplansInputsArr, AppplansRequest, newId, authData)

    if (AppplansFormAction === "add_plans") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Appplans
      const result = await AddAppplans(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        plans_uptoken: result.record_id
      });
      
    }
    
    if (AppplansFormAction === "update_plans") {
      
      // update table Appplans
      const result = await UpdateAppplans(newId, mutatedDataArray, body, authData, `primkey='${plans_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        plans_uptoken: plans_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${AppplansFormAction}`
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