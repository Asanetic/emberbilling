import { mosyCountRows, mosySqlInsert } from "../apiUtils/dataControl/dataUtils";

export async function addInventoryItem(req, newItemId, authData)
{

    const sentItemId  = req.txt_item_id
    const itemName = req.txt__inventory_item_name_item_id

    const site_id = authData.hive_site_id

    const checkItemName = await mosyCountRows("inventory",`where hive_site_id='${site_id}' and record_id='${sentItemId}' and item_name='${itemName}'`)

    console.log(`add invoie items add inventoryyy ${newItemId}`)

    if(Number(checkItemName)==0)
    {

      const ProductandservicesInputsArr = {
        "record_id":newItemId,
        "item_name" : req.txt__inventory_item_name_item_id, 
        "quantity" : "?", 
        "rate" : "?", 
        "tax" : "?", 
        "discount" : "?", 
        "date_created" : "?", 
        "item_remark" : "?", 
        "hive_site_id" : authData.hive_site_id, 
        "hive_site_name" : authData.hive_site_name, 
      
      };

      // Insert into table Productandservices      
      const result = await mosySqlInsert("inventory", ProductandservicesInputsArr, req);
                    
        return Response.json({
              status: 'success',
              message: result.message,
              inventory_uptoken: result.record_id
        });
            
    }
}


export async function cloneInvoiceItems(invoiceItemsList, invoiceId, authData)
{
    for (const item of invoiceItemsList) {
          
    //--- Begin  invoice_items inputs array ---// 
    const invoiceItemRow = {
  
      "invoice_id" : invoiceId, 
      "item_name" : item.item_name, 
      "item_remark" : item.item_remark, 
      "quantity" : item.quantity, 
      "rate" : item.quantity, 
      "item_id" : item.item_id,  
      "hive_site_id" : authData.hive_site_id, 
      "hive_site_name" : authData.hive_site_name, 
  
    };
  
    await mosySqlInsert("invoice_items",invoiceItemRow)

    }

}
