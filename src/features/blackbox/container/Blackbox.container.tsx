"use client"
import React, { useState } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { TestList } from '../components/TestList';
import { TestResult } from '../components/TestResult';
import { TestItem, TestResult as TestResultType } from '../types/index';
import { createOrder, getOrdersByPhone, updateOrderStatus } from '@/features/database/actions/orders';
import { getAvailableBurgers, seedDatabase } from '@/features/database/actions/menu';
import { OrderStatus, PaymentStatus, Order, CreateOrderDTO, Burger } from '@/features/database/types';

export default function BlackboxContainer() {
  const theme = useTheme();
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [testResult, setTestResult] = useState<TestResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSelect = (test: TestItem) => {
    setSelectedTest(test);
    setTestResult(null);
  };

  const handleRunTest = async (test: TestItem) => {
    setIsLoading(true);
    try {
      const result = await test.run();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testItems: TestItem[] = [
    {
      id: '1',
      name: 'Create Order',
      category: 'orders',
      description: 'Create a new order',
      run: async () => {
        const order: CreateOrderDTO = {
          customerPhone: '123456789',
          items: [
            {
              burgerId: '1',
              removedIngredients: [],
              quantity: 1,
              price: 10,
              note: 'No onions please'
            },
          ],
          totalPrice: 10,
          status: OrderStatus.WAITING_PAYMENT,
          paymentInfo: {
            bankAccount: '123456789',
            transferReference: '123456789',
            paymentStatus: PaymentStatus.PENDING
          },
        };
        const result = await createOrder(order);
        return {
          success: result.success,
          data: { message: `Order created with ID: ${result.orderId}` },
          error: result.error
        };
      },
    },
    {
      id: '2',
      name: 'Get Orders by Phone',
      category: 'orders',
      description: 'Get all orders for a phone number',
      run: async () => {
        const orders = await getOrdersByPhone('123456789');
        if (!orders) {
          return {
            success: false,
            error: 'No orders found'
          };
        }
        return {
          success: true,
          data: orders as Order[]
        };
      },
    },
    {
      id: '3',
      name: 'Update Order Status',
      category: 'orders',
      description: 'Update order status',
      run: async () => {
        const result = await updateOrderStatus('1', OrderStatus.COMPLETED);
        return {
          success: result.success,
          data: { message: result.message || 'Order status updated successfully' },
          error: result.error
        };
      },
    },
    {
      id: '4',
      name: 'Get Available Burgers',
      category: 'menu',
      description: 'Get all available burgers',
      run: async () => {
        const burgers = await getAvailableBurgers();
        if (!burgers || burgers.length === 0) {
          return {
            success: false,
            error: 'No burgers found'
          };
        }
        return {
          success: true,
          data: burgers as Burger[]
        };
      },
    },
    {
      id: '5',
      name: 'Seed Database',
      category: 'database',
      description: 'Seed database with initial data',
      run: async () => {
        const result = await seedDatabase();
        return {
          success: true,
          data: { message: result.message }
        };
      },
    },
  ];

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(30,30,30,1) 100%)'
        : 'linear-gradient(145deg, rgba(240,240,240,1) 0%, rgba(250,250,250,1) 100%)',
    }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(40,40,40,1) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)',
          boxShadow: theme.shadows[4],
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 4,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Blackbox Testing Suite
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: '70vh',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: { md: 300 },
              maxWidth: { md: 400 },
            }}
          >
            <TestList
              items={testItems}
              selectedTest={selectedTest}
              onTestSelect={handleTestSelect}
            />
          </Box>
          <Box
            sx={{
              flex: 2,
              minWidth: 0,
            }}
          >
            {selectedTest ? (
              <TestResult
                test={selectedTest}
                result={testResult}
                isLoading={isLoading}
                onRun={() => handleRunTest(selectedTest)}
              />
            ) : (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  No Test Selected
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Please select a test from the list to begin
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 