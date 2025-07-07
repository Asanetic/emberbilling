
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SubscriptionpaymentsRowMutations} from './SubscriptionpaymentsRowMutations';

import listSubscriptionpaymentsRowMutationsKeys from './SubscriptionpaymentsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddSubscriptionpayments, UpdateSubscriptionpayments } from './SubscriptionpaymentsDbGateway';


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
      tbl: 'billing_transactions',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('billing_transactions', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('billing_transactions', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listSubscriptionpaymentsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SubscriptionpaymentsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Subscriptionpayments data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Subscriptionpayments failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SubscriptionpaymentsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SubscriptionpaymentsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SubscriptionpaymentsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SubscriptionpaymentsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SubscriptionpaymentsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SubscriptionpaymentsFormAction = body.billing_transactions_mosy_action;
    const billing_transactions_uptoken_value = base64Decode(body.billing_transactions_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  billing_transactions inputs array ---// 
  const SubscriptionpaymentsInputsArr = {

    "trx_id" : "?", 
    "trx_date" : "?", 
    "trx_month_year" : "?", 
    "trx_remark" : "?", 
    "amount" : "?", 
    "trx_type" : "?", 
    "business_id" : "?", 
    "client_id" : "?", 
    "admin_id" : "?", 
    "TransactionType" : "?", 
    "BusinessShortCode" : "?", 
    "BillRefNumber" : "?", 
    "InvoiceNumber" : "?", 
    "OrgAccountBalance" : "?", 
    "ThirdPartyTransID" : "?", 
    "MSISDN" : "?", 
    "FirstName" : "?", 
    "MiddleName" : "?", 
    "LastName" : "?", 
    "trx_msg" : "?", 
    "account_id" : "?", 
    "used_status" : "?", 
    "filter_date" : "?", 
    "flw_id" : "?", 
    "flag_state" : "?", 
    "reconciled" : "?", 
    "corrected_number" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "app_id" : "?", 

  };

  //--- End billing_transactions inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('billing_transactions',SubscriptionpaymentsInputsArr, SubscriptionpaymentsRequest, newId, authData)

    if (SubscriptionpaymentsFormAction === "add_billing_transactions") 
    {
      
      mutatedDataArray.trxkey = newId;
      
      // Insert into table Subscriptionpayments
      const result = await AddSubscriptionpayments(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        billing_transactions_uptoken: result.record_id
      });
      
    }
    
    if (SubscriptionpaymentsFormAction === "update_billing_transactions") {
      
      // update table Subscriptionpayments
      const result = await UpdateSubscriptionpayments(newId, mutatedDataArray, body, authData, `primkey='${billing_transactions_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        billing_transactions_uptoken: billing_transactions_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SubscriptionpaymentsFormAction}`
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