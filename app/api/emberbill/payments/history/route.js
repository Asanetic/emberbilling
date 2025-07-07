
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SubscriptionpaymentsRowMutations} from './SubscriptionpaymentsRowMutations';

import listSubscriptionpaymentsRowMutationsKeys from './SubscriptionpaymentsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';
import { corsHeaders } from '../../../apiUtils/dataControl/cors';
import { withCors } from '../../../apiUtils/dataControl/withCors';

  export async function OPTIONS() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }


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
     
    // if (!isTokenValid) {
    //   return Response.json(
    //     { status: 'unauthorized', message: tokenError },
    //     { status: 403 }
    //   );
    // }
    

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

      return withCors({
        status: 'success',
        message: 'Subscriptionpayments data retrieved',
        ...result,
      })
      
   }
  } catch (err) {
    console.error('GET Subscriptionpayments failed:', err);
    return withCors({
      status: 'success',
      message: 'Subscriptionpayments data retrieved',
      ...result,
    }, 500);
  }
}

