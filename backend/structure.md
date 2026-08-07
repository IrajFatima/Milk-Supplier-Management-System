<!-- @format -->

backend/
├── package.json
├── package-lock.json
├── tsconfig.json
├── schema.sql
└── src/
├── app.ts
├── server.ts
├── config/
│ ├── database.ts
│ └── env.ts
├── middleware/
│ ├── authenticate.ts
│ ├── authorize.ts
│ ├── errorHandler.ts
│ └── notFound.ts
├── modules/
│ ├── animals/
│ │ ├── index.ts
│ │ ├── animal.controller.ts
│ │ ├── animal.service.ts
│ │ ├── animal.repository.ts
│ │ ├── animal.routes.ts
│ │ └── animal.validator.ts
│ ├── auth/
│ │ ├── index.ts
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.repository.ts
│ │ ├── auth.routes.ts
│ │ └── auth.validator.ts
│ ├── customers/
│ │ ├── index.ts
│ │ ├── customer.controller.ts
│ │ ├── customer.service.ts
│ │ ├── customer.repository.ts
│ │ ├── customer.routes.ts
│ │ └── customer.validator.ts
│ ├── production/
│ │ ├── index.ts
│ │ ├── production.controller.ts
│ │ ├── production.service.ts
│ │ ├── production.repository.ts
│ │ ├── production.routes.ts
│ │ └── production.validator.ts
│ ├── temperature-logs/
│ │ ├── index.ts
│ │ ├── temperature-logs.controller.ts
│ │ ├── temperature-logs.service.ts
│ │ ├── temperature-logs.repository.ts
│ │ ├── temperature-logs.routes.ts
│ │ ├── temperature-logs.validator.ts
│ │ └── temperature-simulator.job.ts
│ ├── deliveries/
│ │ ├── index.ts
│ │ ├── delivery.controller.ts
│ │ ├── delivery-planning.job.ts
│ │ ├── delivery.service.ts
│ │ ├── delivery.repository.ts
│ │ ├── delivery.routes.ts
│ │ └── delivery.validator.ts
│ ├── dashboard/
│ │ ├── index.ts
│ │ ├── dashboard.controller.ts
│ │ ├── dashboard.service.ts
│ │ ├── dashboard.repository.ts
│ │ └── dashboard.routes.ts
│ ├── system-configurations/
│ │ ├── index.ts
│ │ ├── systemConfiguration.controller.ts
│ │ ├── systemConfiguration.service.ts
│ │ ├── systemConfiguration.repository.ts
│ │ ├── systemConfiguration.routes.ts
│ │ └── systemConfiguration.validator.ts
│ ├── orders/
│ │ ├── index.ts
│ │ ├── order.controller.ts
│ │ ├── order.service.ts
│ │ ├── order.repository.ts
│ │ ├── order.routes.ts
│ │ ├── order.validator.ts
│ │ └── helpers/
│ │ └── cutoff.helper.ts
│ └── users/
└── shared/
├── constants/
│ ├── animal.ts
│ ├── config.ts
│ ├── delivery.ts
│ ├── dashboard.ts
│ ├── order.ts
│ ├── customer.ts
│ ├── user.ts
│ └── roles.ts
├── errors/
│ └── AppError.ts
├── types/
│ ├── animal.types.ts
│ ├── auth.types.ts
│ ├── systemConfigurations.types.ts
│ ├── customer.types.ts
│ ├── production.types.ts
│ ├── delivery.types.ts
│ ├── dashboard.types.ts
│ ├── order.types.ts
│ ├── temperature.types.ts
│ └── user.types.ts
├── utils/
│ ├── databaseHealth.ts
│ ├── encryption.ts
│ ├── jwt.ts
│ └── password.ts
└── validators/ (empty directory)
