import { Suspense } from 'react';

import MyaccountProfile from '../uiControl/MyaccountProfile';

import { InteprateMyaccountEvent } from '../dataControl/MyaccountRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "My account profile"//searchParams?.mosyTitle || "My account";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `My account profile`,
    description: 'emberbill My account',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function MyaccountMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <MyaccountProfile 
                    dataIn={{ parentUseEffectKey: "initMyaccountProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateMyaccountEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}