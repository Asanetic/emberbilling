
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert billing_transactions 
export async function AddSubscriptionpayments(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("billing_transactions", mutatedDataArray, body);
   
  return result;
}


//update billing_transactions 
export async function UpdateSubscriptionpayments(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("billing_transactions", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete billing_transactions 
export async function DeleteSubscriptionpayments(tokenId, whereStr)
{  
  const result = await mosySqlDelete("billing_transactions", whereStr);

  return result;
}

