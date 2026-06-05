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
    maintenance_by_type: [
      { type: "scheduled", open: 8, completed: 12, total: 20 },
      { type: "corrective", open: 5, completed: 3, total: 8 },
      { type: "preventive", open: 3, completed: 18, total: 21 },
      { type: "inspection", open: 2, completed: 7, total: 9 },
    ],
    opname_summary: {
      id: 1,
      name: "Q2 2026 Stocktake - IT Dept",
      status: "in_progress",
      total_items: 86,
      counted_items: 52,
      start_date: new Date(Date.now() - 14 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      match_count: 44,
      mismatch_count: 5,
      not_found_count: 2,
      extra_count: 1,
    },
    activity_trend: [
      { month: "2026-01", count: 48 },
      { month: "2026-02", count: 62 },
      { month: "2026-03", count: 55 },
      { month: "2026-04", count: 71 },
      { month: "2026-05", count: 83 },
      { month: "2026-06", count: 39 },
    ],
    recent_activities: [],
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
