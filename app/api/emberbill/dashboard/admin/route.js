import {mosyFlexSelect, toNum} from '../../../apiUtils/dataControl/dataUtils';

export async function GET() {
      // ✅ Provide default fallbacks
      const payOutHist = {
        tbl: 'payment_receivers',
        colstr: btoa(" DATE_FORMAT(time_sent, '%Y-%m-%d') as date_sent , sum(amount_to_send) as value"), // default to *
        q : btoa("group by date_sent") 
      };

      // ✅ Provide default fallbacks
      const depositHist = {
        tbl: 'cash_deposits',
        colstr: btoa(" project_id, sum(amount_posted) as value"), // default to *
        q : btoa("group by project_id") 
      };      

  
      //chart data 
      const mutations = {_advertisers_business_name_advertiser_id : []}
 
      const payOutHistRes = await mosyFlexSelect(payOutHist);
  
      const depositHistRes = await mosyFlexSelect(depositHist);

      const chartData = [
        // {
        //   title: "Ad by Merchant",
        //   chartType: "doughnut",
        //   dataKey: "_advertisers_business_name_advertiser_id",
        //   data: adByMerchantResult?.data ?? [],
        //   containerClass: "col-md-6"
        // },
        // {
        //   title: "Advertiser spending",
        //   chartType: "pie",
        //   dataKey: "_advertisers_business_name_advertiser_id",
        //   data: adByCategoryResult?.data ?? [],
        //   containerClass: "col-md-6"

        // },

        {
          title: "Payout history",
          chartType: "line",
          dataKey: "date_sent",
          data: payOutHistRes?.data ?? [],
          series: [{ key: "value", color: "#2663A6", name: "Amount" }],
          height: 350,
          containerClass: "col-md-6"

        },


        {
          title: "Deposit by project",
          chartType: "bar",
          dataKey: "project_id",
          data: depositHistRes?.data ?? [],
          series: [{ key: "value", color: "#2663A6", name: "Amount" }],
          height: 350,
          containerClass: "col-md-6"

        },

      ];
      
      //card data 
      const deposits = await mosyFlexSelect({tbl:"cash_deposits",colstr:btoa("sum(amount_posted) as total_deposits")})
      const sent = await mosyFlexSelect({tbl:"payment_receivers",colstr:btoa("sum(amount_to_send) as total_sent"), q:btoa(`where status='Paid'`)})
      const pending = await mosyFlexSelect({tbl:"payment_receivers",colstr:btoa("sum(amount_to_send) as pending_payment"), q: btoa(`where status!='Sent'`)})

      const availableBal = deposits-sent 

      const cardData = [
        {
          title: 'Deposits',
          value: `KES ${deposits?.data[0].total_deposits || "0"}`,
          percentage: '',
          icon: "FaCopy",
        },
        {
          title: 'Amount sent',
          value: `KES ${sent?.data[0].total_sent || "0"}`,
          percentage: '',
          icon: "FaUsers",
        },
        {
          title: 'Pending payment',
          value: `KES ${pending?.data[0].total_paid || "0"}`,
          percentage: '',
          icon: "FaCheckCircle",
        },
        {
          title: 'Balance',
          value: `KES ${availableBal || "0"}`,
          percentage: '',
          icon: "FaCreditCard",
        },
      
      ];

      return Response.json({
        status: "success",
        message: "Chart data ready!",
        chart_data: chartData,
        cards_data: cardData,
      });

}
