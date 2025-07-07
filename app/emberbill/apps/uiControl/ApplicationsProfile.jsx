'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateApplicationsFormAction, applicationsProfileData , popDeleteDialog, InteprateApplicationsEvent } from '../dataControl/ApplicationsRequestHandler';

//state management
import { useApplicationsState } from '../dataControl/ApplicationsStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//emberbill custom functions
//import {  } from '../../emberbill_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

import SubscriptionplansProfile from '../../plans/uiControl/SubscriptionplansProfile';

import { InteprateSubscriptionplansEvent } from '../../plans/dataControl/SubscriptionplansRequestHandler';


// export profile

export default function ApplicationsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ApplicationsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Applications states
  const [stateItem, stateItemSetters] = useApplicationsState(settersOverrides);
  const app_listNode = stateItem.applicationsNode
  
  // -- basic states --//
  const paramApplicationsUptoken  = stateItem.applicationsUptoken
  const applicationsActionStatus = stateItem.applicationsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setApplicationsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postApplicationsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateApplicationsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postApplicationsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("ApplicationsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    applicationsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("ApplicationsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setSubscriptionplansCustomProfileQuery Script
  const setSubscriptionplansCustomProfileQuery = stateItemSetters.setSubscriptionplansCustomProfileQuery;
  const subscriptionplansCustomProfileQuery =  stateItem.subscriptionplansCustomProfileQuery;
  
  useEffect(() => {
    if (app_listNode?.primkey && setSubscriptionplansCustomProfileQuery) {
      
      const query = `where app_id ='${app_listNode?.app_id}'  `;
      
      const tokenUrl = mosyUrlParam("plans_uptoken")
      
      if(!tokenUrl)
      {
        setSubscriptionplansCustomProfileQuery(query);
      }
      
    }
  }, [app_listNode, setSubscriptionplansCustomProfileQuery]);
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ApplicationsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postApplicationsFormData} encType="multipart/form-data" id="app_list_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {app_listNode?.primkey ? (  <span> Asset profile / {app_listNode?.app_name || ""}</span> ) :(<span> Add App </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramApplicationsUptoken && (
                  <DeleteButton
                  uptoken={paramApplicationsUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && ( <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramApplicationsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramApplicationsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                uptoken={paramApplicationsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton link="./profile" label="Add App " icon="plus-circle" />
              </>
            )}
            
          </div>
        </div></>
        <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
        {/*    Navigation isle      */}
        <div className="row justify-content-center m-0 p-0 col-md-12" id="">
          {/*    Image section isle      */}
          
          <div className="col-md-6 mr-lg-5">
            
            <div className="col-md-12 p-0 text-center mb-3">
              <div className="col-md-12 m-2"><b>Logo</b></div>
              <MosyImageViewer
              media={`/api/mediaroom?media=${btoa((app_listNode?.logo || ""))}`}
              mediaRoot={""}
              defaultLogo={logo.src}
              imageClass="rounded_avatar"
              />
              
              <MosyFileUploadButton
              tblName="app_list"
              attribute="logo"
              />
              <input type="hidden" name="media_app_list_logo" value={app_listNode?.logo || ""}/>
            </div>
            
            
          </div>
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  
                  <MosySmartField
                  module="app_list"
                  field="app_name"
                  label="App Name"
                  value={app_listNode?.app_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="app_list"
                  field="account_id"
                  label="Account Id"
                  value={app_listNode?.account_id || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="app_list"
                  field="payment_redirect"
                  label="Payment Redirect"
                  value={app_listNode?.payment_redirect || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-6 hive_data_cell">
                    <label >Pricing Page Message</label>
                    <MosyHtmlEditor
                    key={`reload - ${app_listNode?.primkey}`}
                    module="app_list"
                    field="txt_pricing_page_message"
                    label="Pricing Page Message"
                    value={app_listNode?.pricing_page_message || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="content_editable"
                    cellOverrides={{additionalClass: "d-none"}}
                    
                    />
                    <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="pricing_page_message_toprint">{app_listNode?.pricing_page_message || ""}</div>
                    
                  </div>
                  
                  
                  <div className="form-group col-md-6 hive_data_cell">
                    <label >App description</label>
                    <MosyHtmlEditor
                    key={`reload - ${app_listNode?.primkey}`}
                    module="app_list"
                    field="txt_remark"
                    label="App description"
                    value={app_listNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="content_editable"
                    cellOverrides={{additionalClass: "d-none"}}
                    
                    />
                    <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="remark_toprint">{app_listNode?.remark || ""}</div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons tblName="app_list" extraClass="optional-custom-class" />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="app_list_uptoken" name="app_list_uptoken" value={paramApplicationsUptoken}/>
              <input type="hidden" id="app_list_mosy_action" name="app_list_mosy_action" value={applicationsActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          {app_listNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage Items`} </h5>
              <SubscriptionplansProfile
              key={`${ subscriptionplansCustomProfileQuery}-${localEventSignature}`}
              dataIn={{
                
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : subscriptionplansCustomProfileQuery,
                hostParent : "ApplicationsProfile",
                customProfileData : {}
                
              }}
              
              dataOut={{
                
                setChildDataOut: InteprateSubscriptionplansEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                
              }}
              />
              
            </section>
          )}
          
        </div>
      </div>
    </div>
    
    
    {/* snack notifications -- */}
    {snackMessage &&(
      <MosySnackWidget
      content={snackMessage}
      duration={5000}
      type="custom"
      onDone={() => {
        stateItemSetters.setSnackMessage("");
        stateItem.snackOnDone(); // Run whats inside onDone
        deleteUrlParam("snack_alert")
      }}
      
      />)}
      {/* snack notifications -- */}
      
      
      {/* ================== End Feature Section========================== ------*/}
    </div>
    
  );
  
}

