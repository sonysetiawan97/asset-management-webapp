import { http, HttpResponse } from "msw";

const mockDashboard = {
  status: true,
  data: {
    stats: {
      total_assets: 284,
      total_categories: 12,
      total_locations: 34,
      total_departments: 8,
      total_users: 45,
      active_checkouts: 23,
      overdue_checkouts: 5,
      pending_approvals: {
        transfers: 3,
        maintenance: 2,
      },
    },
    assets_by_status: {
      available: 120,
      in_use: 88,
      under_maintenance: 42,
      reserved: 18,
      lost: 4,
      pending_transfer: 0,
    },
    assets_by_category: [
      { category_name: "IT Equipment", count: 86, total_value: 450000000 },
      { category_name: "Furniture", count: 52, total_value: 210000000 },
      { category_name: "Vehicles", count: 18, total_value: 580000000 },
      { category_name: "Software License", count: 42, total_value: 95000000 },
      { category_name: "Office Equipment", count: 34, total_value: 120000000 },
      { category_name: "Network Hardware", count: 28, total_value: 175000000 },
      { category_name: "Security Equipment", count: 16, total_value: 82000000 },
    ],
    recent_activities: [
      {
        id: 1,
        action: "CHECKED_OUT",
        description: "Asset MacBook Pro (AST-2024-001) checked out to johndoe",
        user: "admin",
        created_time: new Date(Date.now() - 2 * 60000).toISOString(),
      },
      {
        id: 2,
        action: "CHECKED_IN",
        description: "Asset Dell Monitor (AST-2024-015) checked in, condition: good",
        user: "admin",
        created_time: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 3,
        action: "CREATED",
        description: "New asset Dell PowerEdge R740 (AST-2024-032) registered",
        user: "system",
        created_time: new Date(Date.now() - 60 * 60000).toISOString(),
      },
      {
        id: 4,
        action: "STATUS_CHANGED",
        description: "Status changed from available to under_maintenance for Server Rack",
        user: "techlead",
        created_time: new Date(Date.now() - 120 * 60000).toISOString(),
      },
      {
        id: 5,
        action: "TRANSFER_APPROVED",
        description: "Transfer approved by manager for Cisco Switch (AST-2024-020)",
        user: "manager",
        created_time: new Date(Date.now() - 240 * 60000).toISOString(),
      },
    ],
    financial_summary: {
      total_purchase_value: 1712000000,
      total_book_value: 1284000000,
      total_accumulated_depreciation: 428000000,
    },
  },
};

export const handlers = [
  http.get("/api/v1/dashboard", () => {
    return HttpResponse.json(mockDashboard, { status: 200 });
  }),
];
