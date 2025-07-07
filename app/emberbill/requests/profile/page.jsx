import { Suspense } from 'react';

import PaymentrequestsProfile from '../uiControl/PaymentrequestsProfile';

import { IntepratePaymentrequestsEvent } from '../dataControl/PaymentrequestsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Payment requests profile"//searchParams?.mosyTitle || "Payment requests";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Payment requests profile`,
    description: 'emberbill Payment requests',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function PaymentrequestsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PaymentrequestsProfile 
                    dataIn={{ parentUseEffectKey: "initPaymentrequestsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: IntepratePaymentrequestsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}