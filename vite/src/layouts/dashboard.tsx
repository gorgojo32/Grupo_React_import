import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Box } from '@mui/material';

export default function Layout() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f4e9 25%, #e6d7b8 50%, #d4bc99 75%, #c3a17a 100%)',
        minHeight: '100vh',
        width: '100%',
        backgroundAttachment: 'fixed',
      }}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </Box>
  );
}