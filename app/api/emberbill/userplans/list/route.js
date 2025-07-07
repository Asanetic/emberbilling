
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr, mosyQuickSel } from '../../../apiUtils/dataControl/dataUtils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const appid = searchParams.get('appid');

    const appDetails = await mosyQuickSel("app_list", `where account_id='${appid}'`, "r")

    const appName = appDetails?.app_name
    const appsignature = appDetails?.app_id
    
    
    try {
      const rawPlans = await mosyQuickSel("plans", `where app_id='${appsignature}' order by primkey desc`);
  
      const formattedPlans = rawPlans.map((plan) => ({
        id : plan.record_id,
        name: plan.plan_name || 'Unnamed Plan',
        currency: plan.currency || '',
        price: plan.plan_amount,
        description: plan.remark || '',
        cta: plan.cta || 'Choose Plan',
        href: plan.href || '/signup',
        plan_type: plan.plan_type || 'Active', // optional highlight key
      }));
  
      return Response.json({
         status: 'success', 
         data: formattedPlans,
         summary : appDetails?.pricing_page_message || ""

        });
    } catch (error) {
      console.error('Error fetching plans:', error);
      return Response.json({ status: 'error', message: 'Failed to fetch plans' }, { status: 500 });
    }


    return Response.json(
      {status : `200`,
       data : appPlans 
      }
    )


  } catch (err) {
    console.error('GET Subscriptionplans failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}


