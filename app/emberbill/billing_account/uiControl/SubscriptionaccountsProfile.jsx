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
import { inteprateSubscriptionaccountsFormAction, subscriptionaccountsProfileData , popDeleteDialog, InteprateSubscriptionaccountsEvent } from '../dataControl/SubscriptionaccountsRequestHandler';

//state management
import { useSubscriptionaccountsState } from '../dataControl/SubscriptionaccountsStateManager';

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

// export profile

export default function SubscriptionaccountsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SubscriptionaccountsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Subscriptionaccounts states
  const [stateItem, stateItemSetters] = useSubscriptionaccountsState(settersOverrides);
  const plansNode = stateItem.subscriptionaccountsNode
  
  // -- basic states --//
  const paramSubscriptionaccountsUptoken  = stateItem.subscriptionaccountsUptoken
  const subscriptionaccountsActionStatus = stateItem.subscriptionaccountsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSubscriptionaccountsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSubscriptionaccountsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSubscriptionaccountsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSubscriptionaccountsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("SubscriptionaccountsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    subscriptionaccountsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("SubscriptionaccountsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SubscriptionaccountsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSubscriptionaccountsFormData} encType="multipart/form-data" id="plans_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {plansNode?.primkey ? (  <span> Plan / {plansNode?.plan_id || ""} / {plansNode?.plan_name || ""}</span> ) :(<span>  Add Subscription plan </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSubscriptionaccountsUptoken && (
                  <DeleteButton
                  uptoken={paramSubscriptionaccountsUptoken}
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
                
                
                
                {paramSubscriptionaccountsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramSubscriptionaccountsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                uptoken={paramSubscriptionaccountsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton link="./profile" label=" Add Subscription plan " icon="plus-circle" />
              </>
            )}
            
          </div>
        </div></>
        <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
        {/*    Navigation isle      */}
        <div className="row justify-content-center m-0 p-0 col-md-12" id="">
          {/*    Image section isle      */}
          
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  
                  <MosySmartField
                  module="plans"
                  field="plan_id"
                  label="Plan Id"
                  value={plansNode?.plan_id || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="plans"
                  field="plan_name"
                  label="Plan Name"
                  value={plansNode?.plan_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint="/api/emberbill/apps/applications"
                  tblName="app_list"
                  parentTable="plans"
                  inputName="txt__app_list_app_name_app_id"
                  hiddenInputName="txt_app_id"
                  valueField="app_id"
                  displayField="app_name"
                  label="App name"
                  defaultValue={{ app_id: plansNode?.app_id || "", app_name: plansNode?._app_list_app_name_app_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-7 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <div className="form-group col-md-7 hive_data_cell ">
                    <label className="d-none">Currency</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/emberbill/billing_account/subscriptionaccounts"
                    idField="primkey"
                    labelField="currency"
                    inputName="txt_currency"
                    label="Currency"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={plansNode?.currency || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="plans"
                  field="plan_amount"
                  label="Plan Amount"
                  value={plansNode?.plan_amount || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-7 hive_data_cell ">
                    <label className="d-none">Plan Type</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/emberbill/billing_account/subscriptionaccounts"
                    idField="primkey"
                    labelField="plan_type"
                    inputName="txt_plan_type"
                    label="Plan Type"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={plansNode?.plan_type || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-7 hive_data_cell ">
                    <label className="d-none">Plan Period</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/emberbill/billing_account/subscriptionaccounts"
                    idField="primkey"
                    labelField="plan_period"
                    inputName="txt_plan_period"
                    label="Plan Period"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={plansNode?.plan_period || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-7 hive_data_cell ">
                    <label >Active Status</label>
                    
                    <select name="txt_active_status" id="txt_active_status" className="form-control">
                      <option  value={plansNode?.active_status || ""}>{plansNode?.active_status || "Select Active Status"}</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      
                    </select>
                  </div>
                  
                  
                  <div className="form-group col-md-7 hive_data_cell">
                    <label >Plan description</label>
                    <MosyHtmlEditor
                    key={`reload - ${plansNode?.primkey}`}
                    module="plans"
                    field="txt_remark"
                    label="Plan description"
                    value={plansNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="content_editable"
                    cellOverrides={{additionalClass: "d-none"}}
                    
                    />
                    <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="remark_toprint">{plansNode?.remark || ""}</div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons tblName="plans" extraClass="optional-custom-class" />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="plans_uptoken" name="plans_uptoken" value={paramSubscriptionaccountsUptoken}/>
              <input type="hidden" id="plans_mosy_action" name="plans_mosy_action" value={subscriptionaccountsActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
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

