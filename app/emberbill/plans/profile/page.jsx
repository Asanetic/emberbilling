import { Suspense } from 'react';

import SubscriptionplansProfile from '../uiControl/SubscriptionplansProfile';

import { InteprateSubscriptionplansEvent } from '../dataControl/SubscriptionplansRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Subscription plans profile"//searchParams?.mosyTitle || "Subscription plans";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Subscription plans profile`,
    description: 'emberbill Subscription plans',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function SubscriptionplansMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SubscriptionplansProfile 
                    dataIn={{ parentUseEffectKey: "initSubscriptionplansProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateSubscriptionplansEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}