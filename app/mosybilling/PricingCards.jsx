'use client';

import { useEffect, useState } from 'react';

import { mosyGetData } from '../MosyUtils/hiveUtils';

import { loadPaymentModal} from './PricingExe';
import { MosyCard } from '../components/MosyCard';
import SubscriptionpaymentsList from './payments/uiControl/SubscriptionpaymentsList';

import saAuthConfigs from '../auth/featureConfig/saAuthConfigs'; 


export default function PricingPage() {
  const [appPlans, setAppPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  let sessionPrefix = saAuthConfigs.sessionPrefix;

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await mosyGetData({
          endpoint: '/api/emberbill/userplans/list',
          params: { appid: sessionPrefix },
        });
        console.log('Fetched plans:', response);
        setAppPlans(response);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="" dangerouslySetInnerHTML={{__html : appPlans?.summary}}/>
      </div>

      {loading ? (
        <div className="text-center text-muted">Loading plans...</div>
      ) : (
        <div className="row g-4 col-md-12 justify-content-center">
          {appPlans.data.map((plan, i) => (
            <div className="col-md-4" key={i}>
              <div className={`card border shadow h-100 shadow-sm rounded-4 ${plan.highlight ? 'border border-primary' : ''}`}>
                <div className="card-body d-flex flex-column">
                  <h5 className={`card-title text-center fw-bold border rounded_medium ${plan.highlight ? 'border-info rounded-4 bg-light' : ''} p-3`}>
                    {plan.name}
                  </h5>
                  <h2 className="text-primary">{`${plan.currency} ${plan.price}`}</h2>
                  <p className="text-left "
                    
                    dangerouslySetInnerHTML={{ __html: plan.description }}/>                                    

                  {/* <ul className="list-unstyled mt-3 mb-4 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="mb-2">✅ {feature}</li>
                    ))}
                  </ul> */}
                  <div className="mt-auto">
                    <button type='button' 
                    onClick={()=>{loadPaymentModal(plan.price, plan.id, plan.name)}}
                    className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline-primary'} w-100 rounded-pill`}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export function loadTrxHistory()
{
  MosyCard("", <SubscriptionpaymentsList/>,true, "modal1","mosycard_medium")
}
