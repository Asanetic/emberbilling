import { Suspense } from 'react';

import SubscriptionaccountsProfile from '../uiControl/SubscriptionaccountsProfile';

import { InteprateSubscriptionaccountsEvent } from '../dataControl/SubscriptionaccountsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Subscription accounts profile"//searchParams?.mosyTitle || "Subscription accounts";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Subscription accounts profile`,
    description: 'emberbill Subscription accounts',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function SubscriptionaccountsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SubscriptionaccountsProfile 
                    dataIn={{ parentUseEffectKey: "initSubscriptionaccountsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateSubscriptionaccountsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}