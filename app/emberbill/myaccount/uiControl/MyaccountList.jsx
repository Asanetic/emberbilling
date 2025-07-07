'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from '../../../MosyUtils/hiveUtils';

import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadMyaccountListData, popDeleteDialog, InteprateMyaccountEvent  } from '../dataControl/MyaccountRequestHandler';

//state management
import { useMyaccountState } from '../dataControl/MyaccountStateManager';

//emberbill custom functions
//import {  } from '../../emberbill_custom_functions';

import { UserListCard } from '../../../components/ListLayout'


//export listimport {UserListCard} from '../../../components/ListLayout'

export default function MyaccountList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../myaccount/profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
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
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadMyaccountListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"system_users", keyword:stateItem.myaccountQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> My account </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_system_users" name="txt_system_users" className="custom-search-input form-control" placeholder="Search in My account "
          onChange={(e) => stateItemSetters.setMyaccountQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsystem_users_btn" name="qsystem_users_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {stateItem.myaccountLoading ? (
          <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading My account ...</h5>
        ) : stateItem.myaccountListData.length > 0 ? (
          stateItem.myaccountListData.map((listsystem_users_result, index) => (
            
            <UserListCard
            key={listsystem_users_result.primkey}
            editLink={`${customProfilePath}?system_users_uptoken=${btoa(listsystem_users_result.primkey)}`}
            photoNode={`/api/mediaroom?media=${btoa((listsystem_users_result.user_pic))}`}
            node1={listsystem_users_result.name}
            node4={listsystem_users_result.tel}
            node3={listsystem_users_result.email}
            
            />
          ))
        ) : (
          
          
          <div className="col-md-12 text-center mt-4">
            <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no system users records found</h6>
            
            <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
            <div className="col-md-12 pt-5 " id=""></div>
          </div>
        )}
        <MosyPaginationUi
        tblName="system_users"
        totalPages={stateItem.myaccountListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
    </form>
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
    </div>
  );
  
}

