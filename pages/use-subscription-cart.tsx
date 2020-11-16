import { NextPage } from 'next';
import Layout from '../components/Layout';

import Cart from '../components/Cart';
import SubscriptionSummary from '../components/SubscriptionSummary';
import SaasSubscriptions from '../components/SaasSubscriptions';

const DonatePage: NextPage = () => {
  return (
    <Layout title="Shopping Cart | Next.js + TypeScript Example">
      <div className="page-container">
        <h1>Shopping Cart</h1>
        <p>
          Powered by the{' '}
          <a href="https://useshoppingcart.com">use-shopping-cart</a> React
          hooks library.
        </p>
        <Cart>
          <SubscriptionSummary />
          <SaasSubscriptions />
        </Cart>
      </div>
    </Layout>
  );
};

export default DonatePage;
