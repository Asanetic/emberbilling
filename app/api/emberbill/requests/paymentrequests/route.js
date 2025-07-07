
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {PaymentrequestsRowMutations} from './PaymentrequestsRowMutations';

import listPaymentrequestsRowMutationsKeys from './PaymentrequestsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddPaymentrequests, UpdatePaymentrequests } from './PaymentrequestsDbGateway';


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
      tbl: 'checkout_orders',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('checkout_orders', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('checkout_orders', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listPaymentrequestsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, PaymentrequestsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Paymentrequests data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Paymentrequests failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PaymentrequestsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PaymentrequestsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PaymentrequestsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PaymentrequestsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PaymentrequestsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const PaymentrequestsFormAction = body.checkout_orders_mosy_action;
    const checkout_orders_uptoken_value = base64Decode(body.checkout_orders_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  checkout_orders inputs array ---// 
  const PaymentrequestsInputsArr = {

    "payment_account" : "?", 
    "checkout_date" : "?", 
    "amount" : "?", 
    "tel" : "?", 
    "account_number" : "?", 

  };

  //--- End checkout_orders inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('checkout_orders',PaymentrequestsInputsArr, PaymentrequestsRequest, newId, authData)

    if (PaymentrequestsFormAction === "add_checkout_orders") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Paymentrequests
      const result = await AddPaymentrequests(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        checkout_orders_uptoken: result.record_id
      });
      
    }
    
    if (PaymentrequestsFormAction === "update_checkout_orders") {
      
      // update table Paymentrequests
      const result = await UpdatePaymentrequests(newId, mutatedDataArray, body, authData, `primkey='${checkout_orders_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        checkout_orders_uptoken: checkout_orders_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${PaymentrequestsFormAction}`
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