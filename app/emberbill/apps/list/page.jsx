import { Suspense } from 'react';

import ApplicationsList from '../uiControl/ApplicationsList';

import { InteprateApplicationsEvent } from '../dataControl/ApplicationsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Applications"//searchParams?.mosyTitle || "Applications";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Applications`,
    description: 'emberbill Applications',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function ApplicationsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ApplicationsList  
                    
                     dataIn={{ parentUseEffectKey: "loadApplicationsList" }}
                       
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