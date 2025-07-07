// Configs for Next.js Auth System (sauth_configs)
// appConfigs.js
import Image from 'next/image';
import bgimg from '../../img/loginbg.jpg'; // outside public!
import {hiveRoutes} from '../../appConfigs/hiveRoutes'; 


const commonRoot = "/"; // Adjust to your base path or env var if needed


const saAuthConfigs = {
  sessionPrefix: "emberBill",
  oauthTable: "system_users",
  primkey: "primkey",

  // DB column mappings
  userIdCol: "user_id",
  usernameCol: "name",
  emailCol: "email",
  phoneCol: "tel",
  passwordCol: "login_password",
  sessionColumns : "user_id,email,tel,name,hive_site_id,hive_site_name",

  // Post-login redirect
  afterSplashPage:`${hiveRoutes.emberbilling}/apps/list`,

  // UI toggles
  showResetLink: true, // true || false
  showCreateAccount: true, // true || false

  // Routes (UI component files/pages, not PHP scripts)
  loginUrl: "login",
  registerUrl: "register",
  changePasswordUrl: "resetpassword",
  resetPasswordUrl: "resetpassword",
  
  //Api endpoints
  createUserApi : "/api/emberbill/accounts/create",

  // Login page background + UI widget choice
  loginBgImage: bgimg.src,
  loginWidget: "hive_login_center_wgt", // e.g., hive_login_center_wgt || hive_login_dark_clear_center_wgt
};

export default saAuthConfigs;
