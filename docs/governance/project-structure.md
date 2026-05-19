# Project Structure

```
sagara-vite-react-ts/
├── src/
│   ├── App.tsx                         # Root component (renders <AppRoutes />)
│   ├── main.tsx                        # Entry point (ReactDOM.createRoot)
│   ├── vite-env.d.ts                   # Vite environment type declarations
│   ├── index.css                       # Global styles
│   │
│   ├── assets/                         # Static assets
│   │   ├── images/                     # PNGs, SVGs (logos, backgrounds)
│   │   ├── style/                      # custom.css
│   │   └── js/                         # custom.js
│   │
│   ├── components/                     # Shared / reusable UI components
│   │   ├── auth/                       # Auth-related components
│   │   │   ├── AuthChecker.tsx         # Redirect if already authenticated
│   │   │   ├── AuthMiddleware.tsx       # Route guard (checks auth + privileges)
│   │   │   ├── AuthHelpers.ts          # getAuth(), PrivilegesValidation()
│   │   │   └── AuthPrivilegesChecker.tsx # Sidebar menu visibility guard
│   │   ├── buttons/                    # Button components
│   │   │   ├── BackButton.tsx
│   │   │   ├── CancelButton.tsx
│   │   │   ├── CreateButton.tsx
│   │   │   ├── DeleteButton.tsx
│   │   │   ├── SubmitButton.tsx
│   │   │   └── UpdateButton.tsx
│   │   ├── errors/                     # Error / empty state components
│   │   │   ├── EmptyData.tsx           # Shown when list is empty
│   │   │   └── ErrorRoutes.tsx         # Catches unmatched routes (404/500)
│   │   ├── form/                       # Form input components
│   │   │   ├── inputs/                 # Text, Number, Date, Switch, etc.
│   │   │   ├── select/                 # SingleSelectInput, MultipleSelectInput
│   │   │   └── fileupload/             # Single/Multiple upload for images/files
│   │   ├── icons/                      # Named SVG icon components
│   │   │   └── Icons.tsx             # DashboardIcon, AssetsIcon, etc. (fill="currentColor")
│   │   ├── list/                       # List/table components
│   │   │   ├── Action.tsx              # Row actions (read/edit/delete)
│   │   │   ├── ActionBar.tsx           # Action buttons above table
│   │   │   ├── ListContainer.tsx       # Full list page wrapper
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Title.tsx
│   │   ├── loadings/                   # Loading spinner components
│   │   │   ├── LoadingAuthPage.tsx
│   │   │   ├── LoadingPage.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── menu/                       # Sidebar menu components
│   │   │   ├── SidebarMenuItem.tsx
│   │   │   ├── SidebarParentMenu.tsx   # Collapsible menu group
│   │   │   ├── SidebarMenuTitle.tsx    # Section divider
│   │   │   └── SideBarMenuIcon.tsx     # Icon wrapper (<span>, CSS color via currentColor)
│   │   ├── misc/                       # Misc utilities
│   │   │   ├── UnderConstruction.tsx   # Under-construction placeholder
│   │   │   └── UnderConstructionListWrapper.tsx  # With breadcrumbs auto-set
│   │   └── Modal.tsx                   # Generic modal wrapper
│   │
│   ├── contexts/                       # React contexts (providers)
│   │   ├── ModalContext.tsx / ModalProvider.tsx
│   │   ├── PaginationContext.tsx / PaginationProvider.tsx
│   │   ├── SearchContext.tsx / SearchProvider.tsx
│   │   └── SidebarParentContext.tsx
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── list/
│   │   │   ├── useList.ts              # Generic list fetch (React Query)
│   │   │   ├── usePagination.ts
│   │   │   └── useSearch.ts
│   │   ├── request/
│   │   │   ├── useCreate.ts
│   │   │   ├── useFindAll.ts
│   │   │   ├── useFindOneById.ts
│   │   │   ├── useHardDelete.ts
│   │   │   ├── usePartialUpdate.ts
│   │   │   ├── useRestore.ts
│   │   │   ├── useSoftDelete.ts
│   │   │   └── useUpdate.ts
│   │   ├── useAuth.ts                  # Auth store + user store + logout
│   │   ├── useCapitalize.ts
│   │   ├── useFileDownload.ts
│   │   ├── useFileUpload.ts
│   │   └── useModal.ts
│   │
│   ├── layout/                         # Layout components
│   │   ├── MasterLayout.tsx            # Full app shell (sidebar + header + content)
│   │   ├── AuthLayout.tsx              # Split-screen auth layout
│   │   └── partials/
│   │       ├── header/
│   │       │   ├── Header.tsx
│   │       │   ├── Breadcrumb.tsx
│   │       │   ├── Notification.tsx
│   │       │   ├── PageHeader.tsx
│   │       │   └── PageTitle.tsx
│   │       └── sidebar/
│   │           └── Sidebar.tsx         # Navigation sidebar
│   │
│   ├── mocks/                          # MSW (Mock Service Worker) setup
│   │   ├── browser.ts
│   │   ├── server.ts
│   │   ├── setupTest.ts
│   │   └── handlers/                   # Mock API handlers by module
│   │
│   ├── modules/                        # Feature modules (module-per-feature)
│   │   ├── auth/                       # Sign in, register, auth service
│   │   ├── dashboard/                  # Dashboard page
│   │   ├── errors/                     # 404, Unauthenticated, Unauthorized
│   │   ├── examples/                   # Example CRUD module (reference implementation)
│   │   ├── products/                   # Products module
│   │   ├── profile/                   # User profile (detail + update)
│   │   ├── suppliers/                 # Suppliers module
│   │   ├── privileges/                 # RBAC privileges (full CRUD + trash)
│   │   ├── roles/                      # RBAC roles (full CRUD + trash)
│   │   ├── sysparam/                   # System parameters (full CRUD + trash)
│   │   ├── trash/                      # Soft-deleted items view
│   │   └── users/                     # Users (full CRUD + trash)
│   │
│   ├── routes/                         # Top-level route configuration
│   │   ├── AppRoutes.tsx               # Root router (auth vs. private split)
│   │   └── PrivateRoutes.tsx           # All authenticated routes + MasterLayout
│   │
│   ├── services/                       # Generic CRUD service functions
│   │   ├── create.ts
│   │   ├── findAll.ts
│   │   ├── findOneById.ts
│   │   ├── hardDelete.ts
│   │   ├── partialUpdate.ts
│   │   ├── restore.ts
│   │   ├── softDelete.ts
│   │   └── update.ts
│   │
│   ├── stores/                         # nanostores (reactive atoms)
│   │   ├── BreadcrumbStore.ts          # Breadcrumb navigation state
│   │   └── PageHeaderStore.ts          # Page title state
│   │
│   ├── types/                          # Shared TypeScript types
│   │   ├── Breadcrumbs.ts
│   │   ├── ColumnConfig.ts
│   │   ├── File.ts
│   │   ├── FileUpload.ts
│   │   ├── ListOption.ts
│   │   ├── PageHeader.ts
│   │   └── SelectOption.ts
│   │
│   └── utils/                          # Utilities
│       ├── authAxios.ts                # Axios instance with Bearer token
│       ├── axiosSetup.ts
│       ├── publicAxios.ts              # Axios without auth (for auth endpoints)
│       ├── uploadAxiosSetup.ts         # Axios for file uploads
│       ├── extractError.ts
│       ├── i18n.ts                     # i18next configuration
│       └── snackbar.tsx
│
├── docs/governance/                    # AI agent governance documentation
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Module Structure (per feature)

Each module under `src/modules/<name>/` follows this pattern:

```
<name>/
├── PrivateRoutes.tsx            # Route definitions (lazy loaded)
├── types/
│   └── Model.ts                 # moduleName + all interfaces
├── stores/                      # (if needed) module-specific stores
├── hooks/                       # (if needed) module-specific hooks
├── services/                    # (if needed) module-specific API calls
├── components/                  # Shared form inputs for this module
│   └── FormFields.tsx           # All form fields wired to react-hook-form
└── pages/
    ├── list/
    │   ├── ListWrapper.tsx      # Fetches data, sets breadcrumbs, passes to ListPage
    │   └── ListPage.tsx        # Renders the table
    ├── create/
    │   ├── CreateWrapper.tsx    # FormProvider, breadcrumbs, title
    │   └── CreatePage.tsx      # Form + submit logic
    ├── read/
    │   ├── ReadWrapper.tsx
    │   └── ReadPage.tsx        # Read-only detail view
    └── update/
        ├── UpdateWrapper.tsx
        └── UpdatePage.tsx      # Pre-populated form for editing
```

Not all modules have trash (only **users**, **roles**, **privileges**, **sysparams** have trash routes).
