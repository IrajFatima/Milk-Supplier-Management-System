<!-- @format -->

# Order & Subscription Frontend - Implementation Tracker

## Phase 1: Foundation ✅

- [x] Fix `order.service.ts`:
     - [x] `getActiveCustomers()` — change `accountStatus` → `account_status`
     - [x] `bulkCreateOrders()` — send flat array, fix return type
- [x] Create `OrderStatusBadge.tsx`
- [x] Create `CancelConfirmationModal.tsx`

## Phase 2: One-Time Orders CRUD

- [ ] Create `OneTimeOrderSearchBar.tsx`
- [ ] Create `OneTimeOrderFilters.tsx`
- [ ] Create `OneTimeOrderTable.tsx`
- [ ] Create `OneTimeOrderForm.tsx`
- [ ] Create `OneTimeOrderListPage.tsx`
- [ ] Create `OneTimeOrderCreatePage.tsx`
- [ ] Create `OneTimeOrderEditPage.tsx`
- [ ] Create `OneTimeOrderDetailsPage.tsx`
- [ ] Create `BulkOrderEntryGrid.tsx`
- [ ] Create `BulkOrderCreatePage.tsx`

## Phase 3: Subscriptions CRUD

- [ ] Create `SubscriptionTable.tsx`
- [ ] Create `SubscriptionForm.tsx`
- [ ] Create `SubscriptionListPage.tsx`
- [ ] Create `SubscriptionCreatePage.tsx`
- [ ] Create `SubscriptionEditPage.tsx`
- [ ] Create `SubscriptionDetailsPage.tsx`

## Phase 4: Integration

- [ ] Update `navigation.ts`
- [ ] Update `AppRoutes.tsx`
- [ ] Create `OrderLockingIndicator.tsx`

## Backend Dependencies (Required)

- [ ] Milk Types module with `GET /api/milk-types` endpoint
- [ ] `GET /api/orders/cutoff-time` endpoint for locking indicators
