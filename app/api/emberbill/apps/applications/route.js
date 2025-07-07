
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {ApplicationsRowMutations} from './ApplicationsRowMutations';

import listApplicationsRowMutationsKeys from './ApplicationsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddApplications, UpdateApplications } from './ApplicationsDbGateway';


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
      tbl: 'app_list',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('app_list', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('app_list', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listApplicationsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, ApplicationsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Applications data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Applications failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ApplicationsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ApplicationsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ApplicationsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ApplicationsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ApplicationsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const ApplicationsFormAction = body.app_list_mosy_action;
    const app_list_uptoken_value = base64Decode(body.app_list_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  app_list inputs array ---// 
  const ApplicationsInputsArr = {

    "app_name" : "?", 
    "account_id" : "?", 
    "payment_redirect" : "?", 
    "pricing_page_message" : "?", 
    "logo" : "?", 
    "remark" : "?", 

  };

  //--- End app_list inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('app_list',ApplicationsInputsArr, ApplicationsRequest, newId, authData)

    if (ApplicationsFormAction === "add_app_list") 
    {
      
      mutatedDataArray.app_id = newId;
      
      // Insert into table Applications
      const result = await AddApplications(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for logo, if any
                if (body.txt_app_list_logo) {
                  if(body["txt_app_list_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_app_list_logo"], "media/app_list");
                    
                    ApplicationsInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateApplications(newId, { logo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_app_list_logo;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        app_list_uptoken: result.record_id
      });
      
    }
    
    if (ApplicationsFormAction === "update_app_list") {
      
      // update table Applications
      const result = await UpdateApplications(newId, mutatedDataArray, body, authData, `primkey='${app_list_uptoken_value}'`)

      
                // Now handle the file upload for logo, if any
                if (body.txt_app_list_logo) {
                  if(body["txt_app_list_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_app_list_logo"], "media/app_list");
                    
                    ApplicationsInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateApplications(newId, { logo: filePath }, body, authData,  `primkey='${app_list_uptoken_value}'`)
                    
                    let fileToDelete = body.media_app_list_logo;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        app_list_uptoken: app_list_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${ApplicationsFormAction}`
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