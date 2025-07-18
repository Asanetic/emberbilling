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
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadPaymentrequestsListData, popDeleteDialog, IntepratePaymentrequestsEvent  } from '../dataControl/PaymentrequestsRequestHandler';

//state management
import { usePaymentrequestsState } from '../dataControl/PaymentrequestsStateManager';

//emberbill custom functions
//import {  } from '../../emberbill_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//export list
export default function PaymentrequestsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../requests/profile",
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
  
  //manage Paymentrequests states
  const [stateItem, stateItemSetters] = usePaymentrequestsState(settersOverrides);
  
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
    
    loadPaymentrequestsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"checkout_orders", keyword:stateItem.paymentrequestsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Payment requests </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_checkout_orders" name="txt_checkout_orders" className="custom-search-input form-control" placeholder="Search in Payment requests "
          onChange={(e) => stateItemSetters.setPaymentrequestsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qcheckout_orders_btn" name="qcheckout_orders_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
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
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="checkout_orders_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Payment Account</b></th>
              <th scope="col"><b>Checkout Date</b></th>
              <th scope="col"><b>Amount</b></th>
              <th scope="col"><b>Tel</b></th>
              <th scope="col"><b>Account Number</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.paymentrequestsLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="6" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Payment requests ...</h5>
                </td>
              </tr>
            ) : stateItem.paymentrequestsListData?.length > 0 ? (
              stateItem.paymentrequestsListData.map((listcheckout_orders_result, index) => (
                <Fragment key={`_row_${listcheckout_orders_result.primkey}`}>
                  <tr key={listcheckout_orders_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listcheckout_orders_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="checkout_orders"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listcheckout_orders_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listcheckout_orders_result.payment_account}>{magicTrimText(listcheckout_orders_result.payment_account, 70)}</span></td>
                    <td scope="col"><span title={listcheckout_orders_result.checkout_date}>{magicTrimText(listcheckout_orders_result.checkout_date, 70)}</span></td>
                    <td scope="col"><span title={listcheckout_orders_result.amount}>{magicTrimText(listcheckout_orders_result.amount, 70)}</span></td>
                    <td scope="col"><span title={listcheckout_orders_result.tel}>{magicTrimText(listcheckout_orders_result.tel, 70)}</span></td>
                    <td scope="col"><span title={listcheckout_orders_result.account_number}>{magicTrimText(listcheckout_orders_result.account_number, 70)}</span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="6" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no checkout orders records found</h6>
                  
                  <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="checkout_orders"
        totalPages={stateItem.paymentrequestsListPageCount}
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

