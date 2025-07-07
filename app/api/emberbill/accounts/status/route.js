import { corsHeaders } from "../../../apiUtils/dataControl/cors";
import {
    base64Encode,
    mosyCountRows,
    mosyFlexSelect,
    mosyRightNow,
    mosySqlInsert,
    mosySqlUpdate
  } from "../../../apiUtils/dataControl/dataUtils";
import { withCors } from "../../../apiUtils/dataControl/withCors";
  
  export async function OPTIONS() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  export async function POST(request) {
    try {
      const body = await request.json();
  
      const accId = body?.accId?.trim() || '';
      const name = body?.name?.trim() || 'Unknown';
      const email = body?.email?.trim() || '';
      const tel = body?.tel?.trim() || '';
      const appId = body?.appId?.trim() || '';
  
      // ✅ Get trxData safely
      const trxData = body?.trxData || {};
  
      const planId = trxData?.planId || null;
      const planAmtRaw = trxData?.planAmt || "0";
      const planAmt = parseFloat(planAmtRaw);
  
      const transactionList = Array.isArray(trxData?.data) ? trxData.data : [];
  
      // 🧮 Sum all transaction amounts safely
      const totalPaid = transactionList.reduce((sum, txn) => {
        const amt = parseFloat(txn?.amount || 0);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);
  
      // 🧠 Determine activation status: only activate if planAmt > 0 and paid matches
      let activestatus = "Inactive";
      if (!isNaN(planAmt) && planAmt > 0 && totalPaid >= planAmt) {
        activestatus = "Active";
      }
  
      // 🔍 Check for existing account
      const dupAcc = await mosyCountRows("billing_account", `where account_no='${accId}'`);
  
      // 📄 Prepare insert/update data
      const accData = {
        account_name: name,
        account_no: accId,
        app_id: appId,
        date_created: mosyRightNow(),
        account_email: email,
        account_tel: tel,
      };
  

      // 💡 Only include status + plan if there's real transaction data
      if (Array.isArray(transactionList) && transactionList.length > 0) {
        accData.active_status = activestatus;
        accData.plan_id = planId;
        accData.plan_amount = planAmt;
      }


      let accResp;
      if (Number(dupAcc) === 0) {
        
        accData.record_id = accId

        accResp = await mosySqlInsert("billing_account", accData);
      } else {

        accResp = await mosySqlUpdate("billing_account", accData, null, `account_no='${accId}'`);
      }
  
      const accResult = await mosyFlexSelect({
        colstr: base64Encode(`account_name, account_tel, account_email, account_no, active_status`),
        q: base64Encode(`where account_no='${accId}'`),
        tbl: "billing_account"
      });

      const response = {
        status: 'success',
        message:
          activestatus === "Active"
            ? 'Payment verified and account activated'
            : `Payment incomplete. Expected ${planAmt}, received ${totalPaid}`,
        planId,
        totalPaid,
        expected: planAmt,
        activeStatus: activestatus,
        ...accResult,
      };

      return withCors(response)
  
    } catch (err) {
      console.error('POST /myaccount failed:', err);
    
      return withCors({ status: 'error', message: err.message }, 500);

    }
  }
  