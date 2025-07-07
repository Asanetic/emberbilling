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
import { intepratePaymentrequestsFormAction, paymentrequestsProfileData , popDeleteDialog, IntepratePaymentrequestsEvent } from '../dataControl/PaymentrequestsRequestHandler';

//state management
import { usePaymentrequestsState } from '../dataControl/PaymentrequestsStateManager';

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

export default function PaymentrequestsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PaymentrequestsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Paymentrequests states
  const [stateItem, stateItemSetters] = usePaymentrequestsState(settersOverrides);
  const checkout_ordersNode = stateItem.paymentrequestsNode
  
  // -- basic states --//
  const paramPaymentrequestsUptoken  = stateItem.paymentrequestsUptoken
  const paymentrequestsActionStatus = stateItem.paymentrequestsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPaymentrequestsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPaymentrequestsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePaymentrequestsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPaymentrequestsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("PaymentrequestsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    paymentrequestsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("PaymentrequestsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PaymentrequestsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postPaymentrequestsFormData} encType="multipart/form-data" id="checkout_orders_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {checkout_ordersNode?.primkey ? (  <span>Payment requests Profile</span>) : (<span>Add Checkout Orders</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramPaymentrequestsUptoken && (
                  <DeleteButton
                  uptoken={paramPaymentrequestsUptoken}
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
                
                
                
                {paramPaymentrequestsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramPaymentrequestsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                uptoken={paramPaymentrequestsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton link="./profile" label=" Add new" icon="plus-circle" />
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
                  module="checkout_orders"
                  field="payment_account"
                  label="Payment Account"
                  value={checkout_ordersNode?.payment_account || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="checkout_orders"
                  field="checkout_date"
                  label="Checkout Date"
                  value={checkout_ordersNode?.checkout_date || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="checkout_orders"
                  field="amount"
                  label="Amount"
                  value={checkout_ordersNode?.amount || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="checkout_orders"
                  field="tel"
                  label="Tel"
                  value={checkout_ordersNode?.tel || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="checkout_orders"
                  field="account_number"
                  label="Account Number"
                  value={checkout_ordersNode?.account_number || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons tblName="checkout_orders" extraClass="optional-custom-class" />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="checkout_orders_uptoken" name="checkout_orders_uptoken" value={paramPaymentrequestsUptoken}/>
              <input type="hidden" id="checkout_orders_mosy_action" name="checkout_orders_mosy_action" value={paymentrequestsActionStatus}/>
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

