import { Suspense } from 'react';

import PaymentrequestsList from '../uiControl/PaymentrequestsList';

import { IntepratePaymentrequestsEvent } from '../dataControl/PaymentrequestsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Payment requests"//searchParams?.mosyTitle || "Payment requests";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Payment requests`,
    description: 'emberbill Payment requests',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function PaymentrequestsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PaymentrequestsList  
                    
                     dataIn={{ parentUseEffectKey: "loadPaymentrequestsList" }}
                       
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