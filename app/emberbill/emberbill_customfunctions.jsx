import React, { useEffect } from "react";

import {MosyCard} from '../components/MosyCard'
import PricingPage from "../mosybilling/PricingCards";

export function loadBillingPage()
{
  MosyCard("",<PricingPage/>,true,"modal1","mosycard_wide")
}

