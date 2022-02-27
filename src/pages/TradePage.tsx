import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Row, Select, Typography } from 'antd';
import styled from 'styled-components';
import LogoSvg from "../assets/logo.svg";
import UserInfoTable from '../components/UserInfoTable';
import {
  getMarketInfos,
  getTradePageUrl,
  MarketProvider,
  useMarket,
  useMarketsList,
  useUnmigratedDeprecatedMarkets,
} from '../utils/markets';
import TradeForm from '../components/TradeForm';
import TradesTable from '../components/TradesTable';
// import LinkAddress from '../components/LinkAddress';
import DeprecatedMarketsInstructions from '../components/DeprecatedMarketsInstructions';
import {
  DeleteOutlined,
  // InfoCircleOutlined,
  // PlusCircleOutlined,
} from '@ant-design/icons';
import CustomMarketDialog from '../components/CustomMarketDialog';
import { notify } from '../utils/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';

// import { TVChartContainer } from '../components/TradingView';
import TVChartContainer from '../components/NormalChart/NormalChart';
import WalletConnect from '../components/WalletConnect';
// Use following stub for quick setup without the TradingView private dependency
// function TVChartContainer() {
//   return <></>
// }

const { Option, OptGroup } = Select;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

const StyledSelect = styled(Select)`
  width: 150px; height: 40px;
  font-size: 14px;
  @media(max-width: 450px){
    width: 120px;
  }
`

export default function TradePage() {
  const { marketAddress } = useParams();
  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);
  const navigate = useNavigate();
  function setMarketAddress(address) {
    navigate(getTradePageUrl(address));
  }

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >
      <TradePageInner  />
    </MarketProvider>
  );
}

function TradePageInner() {
  const {
    // market,
    marketName,
    customMarkets,
    setCustomMarkets,
    setMarketAddress,
  } = useMarket();
  const markets = useMarketsList();
  const [handleDeprecated, setHandleDeprecated] = useState(false);
  const [addMarketVisible, setAddMarketVisible] = useState(false);
  const deprecatedMarkets = useUnmigratedDeprecatedMarkets(); 
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    // document.title = marketName ? `${marketName} — SolBunny` : 'SolBunny';
    document.title = 'SolBunny';
  }, [marketName]);

  const changeOrderRef =
    useRef<({ size, price }: { size?: number; price?: number }) => void>();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = dimensions?.width;
  const height = dimensions?.height;
  const componentProps = {
    onChangeOrderRef: (ref) => (changeOrderRef.current = ref),
    onPrice: useCallback(
      (price) => changeOrderRef.current && changeOrderRef.current({ price }),
      [],
    ),
    onSize: useCallback(
      (size) => changeOrderRef.current && changeOrderRef.current({ size }),
      [],
    ),
  };
  const component = (() => {
    if (handleDeprecated) {
      return (
        <DeprecatedMarketsPage
          switchToLiveMarkets={() => setHandleDeprecated(false)}
        />
      );
    } else if (width < 1000) {
      return (
        <RenderSmaller {...componentProps} width={width} height={height} />
      );
    } else if (width < 1450) {
      return <RenderSmall {...componentProps} width={width} height={height} />;
    } else {
      return <RenderNormal {...componentProps} width={width} height={height} />;
    }
  })();

  const onAddCustomMarket = (customMarket) => {
    const marketInfo = getMarketInfos(customMarkets).some(
      (m) => m.address.toBase58() === customMarket.address,
    );
    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      });
      return;
    }
    const newCustomMarkets = [...customMarkets, customMarket];
    setCustomMarkets(newCustomMarkets);
    setMarketAddress(customMarket.address);
  };

  const onDeleteCustomMarket = (address) => {
    const newCustomMarkets = customMarkets.filter((m) => m.address !== address);
    setCustomMarkets(newCustomMarkets);
  };

  return (
    <>
      <CustomMarketDialog
        visible={addMarketVisible}
        onClose={() => setAddMarketVisible(false)}
        onAddCustomMarket={onAddCustomMarket}
      />
      <Wrapper >
        <Row
          align="middle"
          style={{
            paddingLeft: 5,
            paddingRight: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '10px'
          }}
          gutter={16}
        >
          <Row
            align="middle"
            style={{ paddingLeft: 5, paddingRight: 5, display: 'flex'  }}
            gutter={16}
          >
            <Col style={{paddingRight: 0,paddingLeft: 2}}>
              <MarketSelector
                width={width}
                markets={markets}
                setHandleDeprecated={setHandleDeprecated}
                placeholder={'Select market'}
                customMarkets={customMarkets}
                onDeleteCustomMarket={onDeleteCustomMarket}
              />
            </Col>
            {/* {market ? (
              <Col>
                <Popover
                  content={
                    <LinkAddress address={market.publicKey.toBase58()} />
                  }
                  placement="bottomRight"
                  title="Market address"
                  trigger="click"
                >
                  <InfoCircleOutlined style={{ color: '#2abdd2' }} />
                </Popover>
              </Col>
            ) : null} */}
            {/* <Col>
              <PlusCircleOutlined
                style={{ color: '#2abdd2' }}
                onClick={() => setAddMarketVisible(true)}
              />
            </Col> */}
          </Row>

          {/* i am here */}
          <Col>
            <div style={{
              display:'flex', 
              alignItems:'center',
              gap: '10px',
              position: 'relative',
              zIndex: 1,
            }}>
              <h1 style={{
                fontSize: '1.2rem',
                margin: 0,
                color: '#434a59',
                zIndex: 2, 
              }}>Hopdex</h1>
              <img src={LogoSvg} alt="hopdex"
                style={{
                  width: '40px',
                  position:'absolute',
                  left: '50%', top: '50%',
                  transform:'translate(-50%,-50%)',
                  zIndex: 1, 
                  opacity:0.3
                }}
              />
              </div>
          </Col>


          <Col style={{
            paddingLeft: 0, paddingRight: 0
          }}>
            <WalletConnect />
          </Col>
          {deprecatedMarkets && deprecatedMarkets.length > 0 && (
            <React.Fragment>
              <Col>
                <Typography>
                  You have unsettled funds on old markets! Please go through
                  them to claim your funds.
                </Typography>
              </Col>
              <Col>
                <Button onClick={() => setHandleDeprecated(!handleDeprecated)}>
                  {handleDeprecated ? 'View new markets' : 'Handle old markets'}
                </Button>
              </Col>
            </React.Fragment>
          )}
        </Row>
        {component}
      </Wrapper>
    </>
  );
}

function MarketSelector({
  markets,
  placeholder,
  setHandleDeprecated,
  customMarkets,
  onDeleteCustomMarket,
  width,
}) {
  const { market, setMarketAddress } = useMarket();

  const onSetMarketAddress = (marketAddress) => {
    console.log(marketAddress);
    
    setHandleDeprecated(false);
    setMarketAddress(marketAddress);

    console.log(market?.address.toBase58())
    console.log(market?.address)
  };

  const extractBase = (a) => a.split('/')[0];
  const extractQuote = (a) => a.split('/')[1];

  const selectedMarket = getMarketInfos(customMarkets)
    .find(
      (proposedMarket) =>
        market?.address && proposedMarket.address.equals(market.address),
    )
    ?.address?.toBase58();
  

  
  return (
    <StyledSelect
      showSearch
      size={'large'}
      placeholder={placeholder || 'Select a market'}
      optionFilterProp="name"
      onSelect={onSetMarketAddress}
      listHeight={400}
      value={selectedMarket}
      filterOption={(input, option) =>
        option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {customMarkets && customMarkets.length > 0 && (
        <OptGroup label="Custom">
          {customMarkets.map(({ address, name }, i) => (
            <Option
              value={address}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(0, 0, 0)' : null,
              }}
            >
              <Row>
                <Col flex="auto">{name}</Col>
                {selectedMarket !== address && (
                  <Col>
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        onDeleteCustomMarket && onDeleteCustomMarket(address);
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Option>
          ))}
        </OptGroup>
      )}
      <OptGroup label="Markets">
        {markets
          .sort((a, b) =>
            extractQuote(a.name) === 'USDT' && extractQuote(b.name) !== 'USDT'
              ? -1
              : extractQuote(a.name) !== 'USDT' &&
                extractQuote(b.name) === 'USDT'
              ? 1
              : 0,
          )
          .sort((a, b) =>
            extractBase(a.name) < extractBase(b.name)
              ? -1
              : extractBase(a.name) > extractBase(b.name)
              ? 1
              : 0,
          )
          .map(({ address, name, deprecated }, i) => (
            <Option
              value={address.toBase58()}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(0, 0, 0)' : null,
              }}
            >
              {name} {deprecated ? ' (Deprecated)' : null}
            </Option>
          ))}
      </OptGroup>
    </StyledSelect>
  );
}

const DeprecatedMarketsPage = ({ switchToLiveMarkets }) => {
  return (
    <>
      <Row>
        <Col flex="auto">
          <DeprecatedMarketsInstructions
            switchToLiveMarkets={switchToLiveMarkets}
          />
        </Col>
      </Row>
    </>
  );
};

const RenderNormal = ({ onChangeOrderRef, onPrice, onSize, width, height }) => {

  
  return (
    <Row
      style={{
        minHeight: '900px',
        flexWrap: 'nowrap',
      }}
    >
      <Col flex="auto">
        <Row
          style={{
            rowGap: '0px',
            minHeight: '580px',
            margin: '5px',
            flexWrap:'nowrap'
          }}
        >
          <TVChartContainer
            width={width}
            height={height}
            isMobileView={false}
            depth={13}
            smallScreen={true} onPrice={onPrice} onSize={onSize}
          />
          <Col
            flex="500px"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <TradeForm setChangeOrderRef={onChangeOrderRef} />
            {/* <StandaloneBalancesDisplay /> */}
          </Col>
        </Row>
        <Row>
          <UserInfoTable />
          <Col flex={'360px'} style={{ height: '100%' }}>
            <TradesTable smallScreen={false} />
          </Col>
        </Row>
      </Col>
      
      
    </Row>
  );
};

const RenderSmall = ({ onChangeOrderRef, onPrice, onSize, width, height }) => {
  return (
    <>
      <Row>
        <TVChartContainer width={width} height={500} 
          isTabletView={true}
          isMobileView={false} 
          smallScreen={true}
          depth={13}
          onPrice={onPrice}
          onSize={onSize}
        />
      </Row>
      <Row
      // style={{
      //   height: '900px',
      // }}
      >
        <Col
          flex="500px"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <TradeForm setChangeOrderRef={onChangeOrderRef} />
          {/* <StandaloneBalancesDisplay /> */}
        </Col> 
        <Col flex="500px 1 0">
          <UserInfoTable />
        </Col>
        
      </Row>
      <Row>
        <Col flex="auto" style={{ display: 'flex' }}>
          <TradesTable smallScreen={true} />
        </Col>
      </Row>
    </>
  );
};

const RenderSmaller = ({
  onChangeOrderRef,
  onPrice,
  onSize,
  width,
  height,
}) => {
  return (
    <>
      <Row>
        <TVChartContainer width={width} height={400} 
          isMobileView={true}
          smallScreen={true} onPrice={onPrice} onSize={onSize}
        />
      </Row>
      <Row>
        <Col xs={24} sm={12} style={{ display: 'flex' }}>
          <TradeForm style={{ flex: 1 }} setChangeOrderRef={onChangeOrderRef} />
        </Col>
        {/* <Col xs={24} sm={12}>
          <StandaloneBalancesDisplay />
        </Col> */}
      </Row>
      
      <Row>
        <Col flex="auto">
          <UserInfoTable />
        </Col>
      </Row>

      <Row>
        <Col flex="auto">
          <TradesTable smallScreen={true} />
        </Col>
      </Row>

      
      <div style={{height: '30vh'}}></div>
    </>
  );
};
