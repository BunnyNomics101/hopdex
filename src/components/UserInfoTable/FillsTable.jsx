import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { useFills, useMarket, useOpenOrders } from '../../utils/markets';
import DataTable from '../layout/DataTable';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';
import { useWallet } from '../../utils/wallet';
import { useSendConnection } from '../../utils/connection';
import { cancelOrder } from '../../utils/send';
import { notify } from '../../utils/notifications';

const CancelButton = styled(Button)`
  color: #f23b69;
  border: 1px solid #f23b69;
`;

export default function FillsTable({ onCancelSuccess }) {
  const fills = useFills();
  const openOrders = useOpenOrders();

  const { quoteCurrency } = useMarket();
  let { wallet } = useWallet();
  let connection = useSendConnection();

  const [cancelId, setCancelId] = useState(null);

  async function cancel(order) {
    setCancelId(order?.orderId);
    try {
      if (!wallet) {
        return null;
      }

      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
      });
    } catch (e) {
      notify({
        message: 'Error cancelling order',
        description: e.message,
        type: 'error',
      });
      return;
    } finally {
      setCancelId(null);
    }
    onCancelSuccess && onCancelSuccess();
  }

  const columns = [
    {
      title: 'Market',
      dataIndex: 'marketName',
      key: 'marketName',
    },
    // {
    //   title: 'Side',
    //   dataIndex: 'side',
    //   key: 'side',
    //   render: (side) => (
    //     <Tag
    //       color={side === 'buy' ? '#41C77A' : '#F23B69'}
    //       style={{ fontWeight: 700 }}
    //     >
    //       {side.charAt(0).toUpperCase() + side.slice(1)}
    //     </Tag>
    //   ),
    // },
    {
      title: `Size`,
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: `Price`,
      dataIndex: 'price',
      key: 'price',
    },
    // {
    //   title: `Liquidity`,
    //   dataIndex: 'liquidity',
    //   key: 'liquidity',
    // },
    {
      title: quoteCurrency ? `Fees (${quoteCurrency})` : 'Fees',
      dataIndex: 'feeCost',
      key: 'feeCost',
    },
    {
      key: 'orderId',
      render: (order) => (
        <div style={{ textAlign: 'right' }}>
          {order.isOpen && (
            <CancelButton
              icon={<DeleteOutlined />}
              onClick={() => cancel(order)}
              loading={cancelId + '' === order?.orderId + ''}
            ></CancelButton>
          )}
        </div>
      ),
    },
  ];

  const dataSourceFill = (fills || []).map((fill) => ({
    ...fill,
    key: `${fill.orderId}${fill.side}`,
    liquidity: fill.eventFlags.maker ? 'Maker' : 'Taker',
  }));

  // const dataSourceFill = [{
  //   marketName: 'somethng',
  //   size: 1000,
  //   price: 2,
  //   key: '0'
  // }]

  const dataSourceOpenOrders = (openOrders || []).map((order) => ({
    ...order,
    key: order.orderId,
    isOpen: true,
  }));

  const dataSource = [...dataSourceOpenOrders, ...dataSourceFill];
  const minimized = dataSource.slice(0, 10);

  return (
    <>
      <Row>
        <Col span={24}>
          <DataTable
            dataSource={minimized}
            columns={columns}
            pagination={true}
            pageSize={5}
            emptyLabel="No Orders"
          />
        </Col>
      </Row>
    </>
  );
}
