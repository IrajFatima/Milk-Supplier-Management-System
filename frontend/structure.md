<!-- @format -->

frontend/
│
├── public/
│ └── (empty)
│
├── src/
│ │
│ ├── assets/
│ │ └── (empty)
│ │
│ ├── components/ # Shared reusable UI components
│ │ ├── Dropdown.tsx
│ │ ├── Modal.tsx
│ │ ├── Pagination.tsx
│ │ ├── Spinner.tsx
│ │ ├── Table.tsx
│ │ ├── TextArea.tsx
│ │ └── TextField.tsx
│ │
│ ├── constants/ # App-wide constants
│ │ ├── acquisitionSource.ts
│ │ ├── animalBreed.ts
│ │ ├── animalGender.ts
│ │ ├── animalSpecies.ts
│ │ ├── animalStatus.ts
│ │ ├── customer.ts
│ │ ├── delivery.ts
│ │ ├── navigation.ts
│ │ ├── order.ts
│ │ └── roles.ts
│ │
│ ├── context/ # React Context providers
│ │ └── AuthContext.tsx
│ │
│ ├── features/ # Feature-based modules
│ │ │
│ │ ├── animals/
│ │ │ ├── components/
│ │ │ │ ├── AnimalDetails.tsx
│ │ │ │ ├── AnimalFilters.tsx
│ │ │ │ ├── AnimalForm.tsx
│ │ │ │ ├── AnimalSearchBar.tsx
│ │ │ │ ├── AnimalStatusBadge.tsx
│ │ │ │ ├── AnimalTable.tsx
│ │ │ │ ├── ChangeAnimalStatusModal.tsx
│ │ │ │ ├── DeactivateAnimalModal.tsx
│ │ │ │ ├── ReactivateAnimalModal.tsx
│ │ │ │ └── RelocateAnimalModal.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── AnimalDetailsPage.tsx
│ │ │ ├── AnimalListPage.tsx
│ │ │ ├── CreateAnimalPage.tsx
│ │ │ └── EditAnimalPage.tsx
│ │ │
│ │ ├── auth/
│ │ │ ├── components/
│ │ │ │ └── LoginForm.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── AccessDeniedPage.tsx
│ │ │ ├── LoginPage.tsx
│ │ │ ├── NotFoundPage.tsx
│ │ │ └── UserProfile.tsx
│ │ │
│ │ ├── billing/  
│ │ │ └── (empty)
│ │ │
│ │ ├── customers/
│ │ │ ├── components/
│ │ │ │ ├── ChangeCustomerStatusModal.tsx
│ │ │ │ ├── CustomerDetails.tsx
│ │ │ │ ├── CustomerFilters.tsx
│ │ │ │ ├── CustomerForm.tsx
│ │ │ │ ├── CustomerSearchBar.tsx
│ │ │ │ ├── CustomerStatusBadge.tsx
│ │ │ │ └── CustomerTable.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── CreateCustomerPage.tsx
│ │ │ ├── CustomerDetailsPage.tsx
│ │ │ ├── CustomerListPage.tsx
│ │ │ └── EditCustomerPage.tsx
│ │ │
│ │ ├── dashboards/  
│ │ │ └── (empty)
│ │ │
│ │ ├── deliveries/  
│ │ │ ├── components
│ │ │ │ ├── DeliveryDetails.tsx
│ │ │ │ ├── DeliveryFilters.tsx
│ │ │ │ ├── DeliverySearchBar.tsx
│ │ │ │ ├── DeliveryStatusBadge.tsx
│ │ │ │ ├── DeliveryTable.tsx
│ │ │ │ └── AssignDeliveryModal.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── DeliveryDetailsPage.tsx
│ │ │ └── DeliveryListPage.tsx
│ │ │
│ │ ├── orders/
│ │ │ ├── components/
│ │ │ │ ├── CancelOrderModal.tsx
│ │ │ │ ├── ChangeOrderStatusModal.tsx
│ │ │ │ ├── OneTimeOrderForm.tsx
│ │ │ │ ├── OrderDetails.tsx
│ │ │ │ ├── OrderFilters.tsx
│ │ │ │ ├── OrderForm.tsx
│ │ │ │ ├── OrderSearchBar.tsx
│ │ │ │ ├── OrderStatusBadge.tsx
│ │ │ │ ├── OrderTable.tsx
│ │ │ │ ├── ReactivateOrderModal.tsx
│ │ │ │ └── SubscriptionForm.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── CreateOrderPage.tsx
│ │ │ ├── EditOrderPage.tsx
│ │ │ ├── OrderDetailsPage.tsx
│ │ │ └── OrderListPage.tsx
│ │ │
│ │ ├── payments/  
│ │ │ └── (empty)
│ │ │
│ │ ├── production/
│ │ │ ├── components/
│ │ │ │ ├── ProductionDetailCard.tsx
│ │ │ │ ├── ProductionFilters.tsx
│ │ │ │ ├── ProductionForm.tsx
│ │ │ │ ├── ProductionSearchBar.tsx
│ │ │ │ ├── ProductionStatusBadge.tsx
│ │ │ │ ├── ProductionTable.tsx
│ │ │ │ └── VoidProductionModal.tsx
│ │ │ │
│ │ │ └── pages/
│ │ │ ├── ProductionCreatePage.tsx
│ │ │ ├── ProductionDetailsPage.tsx
│ │ │ ├── ProductionEditPage.tsx
│ │ │ └── ProductionListPage.tsx
│ │ │
│ │ ├── reports/  
│ │ │ └── (empty)
│ │ │
│ │ └── temperatureLogs/
│ │ ├── components/
│ │ │ ├── TemperatureLogDetailCard.tsx
│ │ │ ├── TemperatureLogFilters.tsx
│ │ │ ├── TemperatureLogForm.tsx
│ │ │ ├── TemperatureLogsSearchBar.tsx
│ │ │ └── TemperatureLogsTable.tsx
│ │ │
│ │ └── pages/
│ │ ├── TemperatureLogCreatePage.tsx
│ │ ├── TemperatureLogDetailsPage.tsx
│ │ └── TemperatureLogsListPage.tsx
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useAuth.ts
│ │ ├── useDebounce.ts
│ │ └── useInactivityLogout.ts
│ │
│ ├── layouts/ # Layout components
│ │ ├── AuthLayout.tsx
│ │ ├── Footer.tsx
│ │ ├── Header.tsx
│ │ └── Sidebar.tsx
│ │
│ ├── routes/ # Routing configuration
│ │ ├── AppRoutes.tsx
│ │ ├── ProtectedRoute.tsx
│ │ ├── RoleProtectedRoute.tsx
│ │ └── RootRedirect.tsx
│ │
│ ├── services/ # API service layer
│ │ ├── animal.service.ts
│ │ ├── api.ts # Axios instance / base config
│ │ ├── auth.service.ts
│ │ ├── customer.service.ts
│ │ ├── delivery.service.ts
│ │ ├── order.service.ts
│ │ ├── production.service.ts
│ │ └── temperatureLog.service.ts
│ │
│ ├── types/ # TypeScript type definitions
│ │ ├── animal.types.ts
│ │ ├── api.types.ts
│ │ ├── auth.types.ts
│ │ ├── customer.types.ts
│ │ ├── delivery.types.ts
│ │ ├── order.types.ts
│ │ ├── production.types.ts
│ │ ├── temperature.types.ts
│ │ └── user.types.ts
│ │
│ ├── utils/ # Utility/helper functions
│ │ ├── FormatDate.ts
│ │ └── getApiErrorMessage.ts
│ │
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ └── main.tsx
│
├── index.html
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── structure.md
