
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert checkout_orders 
export async function AddPaymentrequests(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("checkout_orders", mutatedDataArray, body);
   
  return result;
}


//update checkout_orders 
export async function UpdatePaymentrequests(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("checkout_orders", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete checkout_orders 
export async function DeletePaymentrequests(tokenId, whereStr)
{  
  const result = await mosySqlDelete("checkout_orders", whereStr);

  return result;
}

