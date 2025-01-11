import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Layout } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch account data
  useEffect(() => {
    fetch('http://localhost:5000/api/accounts')
      .then((response) => response.json())
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        setLoading(false);
      });
  }, []);

  // Shorten long keys for display
  const shortenKey = (key) => `${key.slice(0, 20)}...${key.slice(-20)}`;

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Public Key',
      dataIndex: 'public_key',
      key: 'public_key',
      render: (key) => (
        <>
          <span>{shortenKey(key)}</span>
          <Button type="link" onClick={() => copyToClipboard(key)}>
            Copy
          </Button>
        </>
      ),
    },
    {
      title: 'Private Key',
      dataIndex: 'private_key',
      key: 'private_key',
      render: (key) => (
        <>
          <span>{shortenKey(key)}</span>
          <Button type="link" onClick={() => copyToClipboard(key)}>
            Copy
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
          overflow: 'auto',
        }}
      >
        <Title level={2}>Accounts</Title>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey={(record) => record.id || record.name}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: true }} // Add horizontal scrolling for responsiveness
        />
      </Content>
    </Layout>
  );
}

export default Accounts;
