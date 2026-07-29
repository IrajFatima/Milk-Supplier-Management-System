backend/
├── package.json
├── package-lock.json
├── tsconfig.json
├── schema.sql
├── structure.txt
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   ├── database.ts
    │   └── env.ts
    ├── middleware/
    │   ├── authenticate.ts
    │   ├── authorize.ts
    │   ├── errorHandler.ts
    │   └── notFound.ts
    ├── modules/
    │   ├── animals/
    │   │   ├── index.ts
    │   │   ├── animal.controller.ts
    │   │   ├── animal.service.ts
    │   │   ├── animal.repository.ts
    │   │   ├── animal.routes.ts
    │   │   └── animal.validator.ts
    │   ├── auth/
    │   │   ├── index.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.repository.ts
    │   │   ├── auth.routes.ts
    │   │   └── auth.validator.ts
    │   ├── customers/
    │   │   ├── index.ts
    │   │   ├── customer.controller.ts
    │   │   ├── customer.service.ts
    │   │   ├── customer.repository.ts
    │   │   ├── customer.routes.ts
    │   │   └── customer.validator.ts
    │   ├── production/
    │   │   ├── index.ts
    │   │   ├── production.controller.ts
    │   │   ├── production.service.ts
    │   │   ├── production.repository.ts
    │   │   ├── production.routes.ts
    │   │   └── production.validator.ts
    │   ├── temperature-logs/
    │   │   ├── index.ts
    │   │   ├── temperature-logs.controller.ts
    │   │   ├── temperature-logs.service.ts
    │   │   ├── temperature-logs.repository.ts
    │   │   ├── temperature-logs.routes.ts
    │   │   ├── temperature-logs.validator.ts
    │   │   └── temperature-simulator.job.ts
    │   ├── billing/           (empty directory)
    │   ├── deliveries/        (empty directory)
    │   ├── orders/            (empty directory)
    │   ├── payments/          (empty directory)
    │   ├── reports/           (empty directory)
    │   └── users/             (empty directory)
    └── shared/
        ├── constants/
        │   ├── acquisitionSource.ts
        │   ├── animalBreed.ts
        │   ├── animalGender.ts
        │   ├── animalSpecies.ts
        │   ├── animalStatus.ts
        │   ├── customer.ts
        │   └── roles.ts
        ├── errors/
        │   └── AppError.ts
        ├── types/
        │   ├── animal.types.ts
        │   ├── auth.types.ts
        │   ├── customer.types.ts
        │   ├── production.types.ts
        │   ├── temperature.types.ts
        │   └── user.types.ts
        ├── utils/
        │   ├── databaseHealth.ts
        │   ├── jwt.ts
        │   └── password.ts
        └── validators/        (empty directory)