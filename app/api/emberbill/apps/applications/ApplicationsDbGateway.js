
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert app_list 
export async function AddApplications(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("app_list", mutatedDataArray, body);
   
  return result;
}


//update app_list 
export async function UpdateApplications(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("app_list", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete app_list 
export async function DeleteApplications(tokenId, whereStr)
{  
  const result = await mosySqlDelete("app_list", whereStr);

  return result;
}

