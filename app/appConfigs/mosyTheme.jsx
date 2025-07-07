// appConfigs.js
import Image from 'next/image';
import logo from '../img/logo/logo.png'; // outside public!


const commonRoot = ""; // Update this path if needed

const mosyThemeConfigs = {
  // App Identity
  mosyAppName: "Ember billing",
  mosyAppLogo: logo.src,
  mosyAppLogoStyle: {
    width: "auto",
    height: "50px",
  },

  // Color Scheme
  themeName: "Mosy",
  btnBg: "#1FAEE0",
  btnTxt: "#fff",
  ctnBg: "#fff",
  ctnTxt: "#000",
  bodyColor: "rgba(255, 255, 255, 0.9)",
  bodyTxt: "#000",
  navBarBgColor: "#FFF",
  navbarBorderColor: "#ccc",
  navbarBorderSize: "1",
  navShadowClass: "shadow-sm",
  genBorderColor: "#1FAEE0",
  genBorderSize: "1",
  wildColor: "",
  skinPlasma: "rgba(255, 255, 255, 0.0)",
  bodySkinCss: "#fff",

  systemBorderRadius : "30px",

  // Gradient and Sidebar
  btnFirstColor: "#000000",
  btnSecondColor: "#1FAEE0",

  get sideBarBg() {
   // return `linear-gradient(225deg, ${this.btnFirstColor}, ${this.btnSecondColor})`;
    return this.btnTxt;
  },

  get sideBarTxt() {
    return "#000"//this.btnBg;
  },


  get sideBarChipBg() {
    return "#fff"//this.sideBarBg;
  },
  get sideBarChipTxt() {
    return "#000"//this.sideBarTxt;
  },
  sideBarType: "mini-sidebar", // mini-sidebar || ""

  // App Colors Shortcut
  get skinClr() {
    return this.ctnBg;
  },
  get buttonClr() {
    return this.btnBg;
  },
  get genTxtClr() {
    return this.ctnTxt;
  },
  get buttonTxtClr() {
    return this.btnTxt;
  },

  // App Routing (placeholder, update with actual Next.js routes)
  appIndexPage: "/sedcoclient/mywallet",
};

export default mosyThemeConfigs;
