import { Suspense } from 'react';

import SubscriptionplansList from '../uiControl/SubscriptionplansList';

import { InteprateSubscriptionplansEvent } from '../dataControl/SubscriptionplansRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Subscription plans"//searchParams?.mosyTitle || "Subscription plans";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Subscription plans`,
    description: 'emberbill Subscription plans',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function SubscriptionplansMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SubscriptionplansList  
                    
                     dataIn={{ parentUseEffectKey: "loadSubscriptionplansList" }}
                       
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