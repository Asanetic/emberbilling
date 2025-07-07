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
import { inteprateMyaccountFormAction, myaccountProfileData , popDeleteDialog, InteprateMyaccountEvent } from '../dataControl/MyaccountRequestHandler';

//state management
import { useMyaccountState } from '../dataControl/MyaccountStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  MosyFileUploadButton,
  DeleteButton
} from '../../UiControl/componentControl';

//emberbill custom functions
//import {  } from '../../emberbill_custom_functions';

import { UserProfileCard } from '../../../components/ProfileLayout'

// export profileimport {UserProfileCard} from '../../../components/ProfileLayout'


export default function MyaccountProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="MyaccountMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Myaccount states
  const [stateItem, stateItemSetters] = useMyaccountState(settersOverrides);
  const system_usersNode = stateItem.myaccountNode
  
  // -- basic states --//
  const paramMyaccountUptoken  = stateItem.myaccountUptoken
  const myaccountActionStatus = stateItem.myaccountActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setMyaccountNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postMyaccountFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateMyaccountFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postMyaccountFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("MyaccountProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    myaccountProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("MyaccountProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="MyaccountProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
        <form onSubmit={postMyaccountFormData} encType="multipart/form-data" id="system_users_profile_form">
          
          <div className="row justify-content-center m-0 p-0 col-md-12" id="">
            
            <UserProfileCard
            navigationIsle={<div className='row justify-content-center col-md-12 m-0 p-0'>
              {/*    Navigation isle      */}
              <><div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
                <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                  
                  {showNavigationIsle && ( <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                  
                </div>
                <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                  
                  
                  
                  {paramMyaccountUptoken && (
                    <>
                    
                  </>
                )}
                
                {paramMyaccountUptoken && showNavigationIsle && (
                  <>
                  
                  <DeleteButton
                  uptoken={paramMyaccountUptoken}
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
          {/*    Navigation isle      */}</div>}
          profileTitle={<div className='row justify-content-center col-md-12 m-0 p-0'>
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {system_usersNode?.primkey ? (  <span>My account Profile</span>) : (<span>Add System Users</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramMyaccountUptoken && (
                  <DeleteButton
                  uptoken={paramMyaccountUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
          </div>}
          profilePic={`/api/mediaroom?media=${btoa(system_usersNode?.user_pic || '')}`}
          profileUploadBtn={<div className='row justify-content-center col-md-12 m-0 p-0'>
            <MosyFileUploadButton
            tblName="system_users"
            attribute="user_pic"
            /></div>}
            mainContent={<div className='row justify-content-center col-md-12 m-0 p-0'>
              
              
              <div className="col-md-12 row justify-content-center m-0  p-0">
                {/*    Input cells section isle      */}
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  <div className="col-md-12 row justify-content-center p-0 m-0">
                    <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                      
                      <MosySmartField
                      module="system_users"
                      field="name"
                      label="Name"
                      value={system_usersNode?.name || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="system_users"
                      field="email"
                      label="Email"
                      value={system_usersNode?.email || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="system_users"
                      field="tel"
                      label="Tel"
                      value={system_usersNode?.tel || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="system_users"
                      field="login_password"
                      label="Login Password"
                      value={system_usersNode?.login_password || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="password"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons tblName="system_users" extraClass="optional-custom-class" />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="system_users_uptoken" name="system_users_uptoken" value={paramMyaccountUptoken}/>
                  <input type="hidden" id="system_users_mosy_action" name="system_users_mosy_action" value={myaccountActionStatus}/>
                </section>
                
              </div>}
              />
            </div>
          </form>
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
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
    
