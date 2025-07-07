'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { mosyGetLSData, dayTime } from '../MosyUtils/hiveUtils';
import saAuthConfigs from '../auth/featureConfig/saAuthConfigs';
import {destroyAppSession} from '../auth/AuthUtils';

import {hiveRoutes} from '../appConfigs/hiveRoutes'; 
import initSidebarControls from './initSideBarControl'

import {loadBillingPage} from '../mosybilling/PricingExe';

import { loadTrxHistory } from '../mosybilling/PricingCards';

export default function NavSidebar({
  appName = 'MosyApp',
  appLogo = '/img/sampleimg1.jpg',
  userAvatar = '/img/useravatar.png',
  appLogoStyle = { height: '50px', width: 'auto', marginRight: '20px' },
  indexPage = '/',
  commonRoot = ''
}) {
  const { sessionPrefix, usernameCol } = saAuthConfigs;
  const cookieKey = `${sessionPrefix}_sa_authsess_${usernameCol}_val`;

  const [username, setUsername] = useState('User');
  
  useEffect(() => {
    const usernameRaw = mosyGetLSData(cookieKey);
    if (usernameRaw) {
      setUsername(usernameRaw.split(' ')[0]);
    }

    initSidebarControls();


  }, []); // Empty dependency array ensures this runs only on the client side


  const userRole = 'User';
  const notificationCount = 0;
  const navRoutes = hiveRoutes;

  return (
    <>
      <div className="header">
        <div className="header-left">
          <a className="mobile_btn cpointer" id="mobile_btn">
            <i className="fa fa-bars" />
          </a>
          <span id="toggle_btn" className="cpointer">
            <i className="fe fe-text-align-left" />
          </span>
          <Link href={indexPage} className="logo logo-small text-dark" style={{ marginLeft: '-100px' }}>
            <Image src={appLogo} alt="Logo" style={appLogoStyle} width={30} height={30} />
            <span className="bold h5">{appName}</span>
          </Link>
        </div>

        <div className="top-nav-search pt-2">
          <Link href={indexPage} className="logo text-dark">
            <Image src={appLogo} alt="Logo" style={appLogoStyle} width={30} height={30} />
            <span className="bold h5">{appName}</span>
          </Link>
        </div>

        <ul className="nav user-menu">
          <li className="nav-item dropdown has-arrow">
            <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <span className="text-primary mr-2">Good {dayTime()} {username}</span>
              <span className="user-img">
                <Image
                  className="rounded-circle"
                  src={userAvatar}
                  width={31}
                  height={31}
                  alt="Avatar"
                />
              </span>
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Image
                    src={userAvatar}
                    alt="User Image"
                    className="avatar-img rounded-circle"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="user-text">
                  <h6>{username}</h6>
                  <p className="text-muted mb-0">{userRole}</p>
                </div>
              </div>
              <a className="dropdown-item d-none" href="/adminaccount">My Profile</a>
              <a className="dropdown-item d-none" href="/adminaccount">Account Settings</a>
              <a
                className="dropdown-item cpointer"
                onClick={() => {
                    destroyAppSession();
                  
                }}
              >
                Logout
              </a>
            </div>
          </li>
        </ul>
      </div>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
            <li className="menu-title p-4"> </li>      
              
            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/apps/list`}>
                  <i className="fa fa-bolt"></i> <span> Apps </span>
              </a>
            </li>

            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/plans/list`}>
                  <i className="fa fa-copy"></i> <span> Plans </span>
              </a>
            </li>

            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/accounts/list`}>
                  <i className="fa fa-users"></i> <span> Accounts </span>
              </a>
            </li>

            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/payments/list`}>
                  <i className="fa fa-list"></i> <span> Payments </span>
              </a>
            </li>
            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/requests/list`}>
                  <i className="fa fa-shopping-cart"></i> <span> Checkouts </span>
              </a>
            </li>    
            <li>
              <a className="nav-link cpointer " onClick={()=>{loadTrxHistory()}}>
                  <i className="fa fa-database"></i> <span> Billing  </span>
              </a>
            </li>                                                            
            <li>
              <a className="nav-link" href={`${hiveRoutes.emberbilling}/myaccount/list`}>
                <i className="fa fa-shield"></i> <span> My account </span>
              </a>
            </li>                      
            <li>
              <a className="nav-link cpointer" onClick={loadBillingPage}>
                <i className="fa fa-credit-card"></i> <span> Upgrade </span>
              </a>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
