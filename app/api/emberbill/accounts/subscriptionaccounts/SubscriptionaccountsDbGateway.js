
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert billing_account 
export async function AddSubscriptionaccounts(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("billing_account", mutatedDataArray, body);
   
  return result;
}


//update billing_account 
export async function UpdateSubscriptionaccounts(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("billing_account", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete billing_account 
export async function DeleteSubscriptionaccounts(tokenId, whereStr)
{  
  const result = await mosySqlDelete("billing_account", whereStr);

  return result;
}

