import { Suspense } from 'react';

import MyaccountList from '../uiControl/MyaccountList';

import { InteprateMyaccountEvent } from '../dataControl/MyaccountRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "My account"//searchParams?.mosyTitle || "My account";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `My account`,
    description: 'emberbill My account',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function MyaccountMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <MyaccountList  
                    
                     dataIn={{ parentUseEffectKey: "loadMyaccountList" }}
                       
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