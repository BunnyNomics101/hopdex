import {
  HashRouter,
  Navigate,
  Route,
  Routes as Switch,
} from 'react-router-dom';
import TradePage from './pages/TradePage';
import OpenOrdersPage from './pages/OpenOrdersPage';
import React from 'react';
import BalancesPage from './pages/BalancesPage';
import ConvertPage from './pages/ConvertPage';
import BasicLayout from './components/BasicLayout';
import ListNewMarketPage from './pages/ListNewMarketPage';
import NewPoolPage from './pages/pools/NewPoolPage';
import PoolPage from './pages/pools/PoolPage';
import PoolListPage from './pages/pools/PoolListPage';
import { getTradePageUrl } from './utils/markets';
// import { Redirect } from 'react-router';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <BasicLayout>
          <Switch>
            <Route path="/" element={<Navigate to={getTradePageUrl()} />} />
            <Route path="/market/:marketAddress/*" element={<TradePage />} />
            <Route path="/orders" element={<OpenOrdersPage />} />
            <Route path="/balances" element={<BalancesPage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/list-new-market" element={<ListNewMarketPage />} />
            <Route path="/pools" element={<PoolListPage />} />
            <Route path="/pools/new" element={<NewPoolPage />} />
            <Route path="/pools/:poolAddress" element={<PoolPage />} />
          </Switch>
        </BasicLayout>
      </HashRouter>
    </>
  );
}
