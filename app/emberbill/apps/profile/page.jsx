import { Suspense } from 'react';

import ApplicationsProfile from '../uiControl/ApplicationsProfile';

import { InteprateApplicationsEvent } from '../dataControl/ApplicationsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Applications profile"//searchParams?.mosyTitle || "Applications";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Applications profile`,
    description: 'emberbill Applications',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function ApplicationsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ApplicationsProfile 
                    dataIn={{ parentUseEffectKey: "initApplicationsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateApplicationsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}