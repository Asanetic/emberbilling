
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert plans 
export async function AddAppplans(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("plans", mutatedDataArray, body);
   
  return result;
}


//update plans 
export async function UpdateAppplans(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("plans", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete plans 
export async function DeleteAppplans(tokenId, whereStr)
{  
  const result = await mosySqlDelete("plans", whereStr);

  return result;
}

