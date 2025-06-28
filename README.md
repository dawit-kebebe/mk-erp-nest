ERP Backend SystemThis repository hosts the backend for a flexible and robust Enterprise Resource Planning (ERP) system, designed to cater to diverse organizational structures and dynamic workflows through a multi-tenant architecture.Table of ContentsFeaturesTechnologiesRequirementsInstallationEnvironment VariablesAvailable ScriptsDocumentation: How It WorksCore Architectural PrinciplesOrganizational Units: The Flexible HierarchyMulti-Tenancy: Root Organization as TenantRoles, Permissions, and Access ControlDynamic WorkflowsSuper Admin FunctionalityEnsuring Data Integrity: Cycle DetectionFuture EnhancementsFeaturesThis ERP backend is built with extensibility and adaptability at its core, offering:Flexible Organizational Structure: Define and manage complex, non-uniform organizational hierarchies (departments, sub-departments, branches, centers, etc.) using a generic "Organizational Unit" concept.Multi-Tenancy: Securely segregates data for different organizations, treating each root-level organization as an independent tenant.Role-Based Access Control (RBAC): Granular permission management where permissions (feature + action) are grouped into roles, and roles are assigned to users.Dynamic Workflow Engine: Define multi-stage approval processes with configurable criteria (roles, organizational units) and an arbitrary number of steps.Super Admin Oversight: A specialized super admin account with global visibility and management capabilities across all tenants, while maintaining strict data isolation for regular tenant users.Data Integrity: Implements mechanisms to prevent circular dependencies in hierarchical data structures.Robust Configuration: Utilizes Zod for strict validation of environment variables, ensuring application stability.TechnologiesFramework: NestJS (Node.js framework for building efficient, scalable Node.js server-side applications)ORM: TypeORMDatabase: MySQL (Recommended), PostgreSQL (Alternative)Validation: Zod (for environment variables and DTOs)Package Manager: pnpmLanguage: TypeScriptRequirementsEnsure you have the following installed:Node.js: v22.16.0 (or compatible LTS version)pnpm: v10.12.4Operating System: Ubuntu 24.04.2 LTS (build environment)Database: MySQL or PostgreSQL instance accessible from your development environment.InstallationClone the repository:git clone <your-repo-url>
cd <repo-name>
Install dependencies:pnpm install
Create .env file:Copy the .env.example to .env in the project root and configure your environment variables.Environment VariablesThe application relies on environment variables for configuration. Create a .env file in the project root based on the following structure..env# Database Configuration
DB_DBMS=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=''
DB_DATABASE=erp-nest
DB_SYNCHRONIZE=false

#DB_REGION #Only to be used in advanced case of aurora cloud setup
#DB_SECRET_ARN #Only to be used in advanced case of aurora cloud setup
#DB_RESOURCE_ARN #Only to be used in advanced case of aurora cloud setup

# JWT Configuration
JWT_SECRET='GcpFfKWzIT/1xOdyM+lw67IDHZg0uCj6N/wataFB6xh1ydJlfe/+1543lStYZfU+hsbFQXKGq/QOTQ3s/urE4w=='
JWT_EXPIRES_IN=3600

# Application Port
PORT=3000

# CORS Allowed Origins (comma-separated URLs)
ALLOWED_ORIGINS=http://localhost:3000
Environment Variable Validation:The application enforces strict validation of these environment variables using Zod during startup. If any required variable is missing or malformed according to the schema below, the application will not start.DB_DBMS: (Required) Must be one of the supported database management systems (e.g., mysql, postgres, sqlite, mongodb, mssql, mariadb, cockroachdb, sap).DB_HOST: (Required) Database host string.DB_PORT: (Required) Database port number. Defaults to 3306.DB_USERNAME: (Required) Database username string.DB_PASSWORD: (Optional) Database password string. Defaults to an empty string ''.DB_DATABASE: (Required) Database name string.DB_SYNCHRONIZE: (Required) Boolean (true or false) to indicate if database schema synchronization should run. Defaults to false.DB_REGION: (Optional) String, used in advanced Aurora cloud setups.DB_SECRET_ARN: (Optional) String, used in advanced Aurora cloud setups.DB_RESOURCE_ARN: (Optional) String, used in advanced Aurora cloud setups.JWT_SECRET: (Required) JWT secret string. Must be at least 32 characters long.JWT_EXPIRES_IN: (Required) JWT expiration time in seconds. Must be a positive number. Defaults to 3600.PORT: (Required) Application port number. Defaults to 3000.ALLOWED_ORIGINS: (Required) A comma-separated string of allowed CORS origins. This string is transformed into an array of validated URLs. Defaults to http://localhost:3000.Available ScriptsIn the project directory, you can run:pnpm run build: Compiles the TypeScript source code into JavaScript.pnpm run format: Formats TypeScript files using Prettier.pnpm start: Starts the application in production mode (node dist/main).pnpm start:dev: Starts the application in development mode with file watching and hot-reloading.pnpm start:debug: Starts the application in development mode with debugging enabled and file watching.pnpm start:prod: Starts the application in production mode directly from the compiled dist/main.js.pnpm run lint: Lints TypeScript files and attempts to fix issues.pnpm test: Runs unit tests.pnpm test:watch: Runs unit tests in watch mode.pnpm test:cov: Runs unit tests and generates a code coverage report.pnpm test:debug: Runs unit tests with debugger attached.pnpm test:e2e: Runs end-to-end tests.pnpm run migration:create -- -n <MigrationName>: Creates a new TypeORM migration file.pnpm run migration:run: Runs all pending TypeORM migrations.pnpm run migration:revert: Reverts the last executed TypeORM migration.pnpm run migration:generate -- -n <MigrationName>: Generates a new TypeORM migration based on schema changes.Documentation: How It WorksThis section explains the core architectural principles and key modules of the ERP backend.Core Architectural PrinciplesThe ERP system is designed for maximum flexibility and scalability, focusing on:Modularity: Breaking down functionality into distinct, reusable modules.Dependency Injection: Leveraging NestJS's powerful DI container for managing services and their dependencies.Type Safety: Extensive use of TypeScript across the entire codebase to reduce errors and improve maintainability.Data Integrity: Implementing robust checks to maintain the consistency and correctness of hierarchical data.Organizational Units: The Flexible HierarchyThe system models organizational structures using a generic concept of "Organizational Units." This allows for highly flexible and non-uniform hierarchies across different branches or organizations.Definition: An OrganizationalUnit is a fundamental entity characterized by:id: A unique identifier.name: A descriptive name (e.g., "Head Office", "Finance Department", "Addis Branch").parentUnitId: An optional reference to another OrganizationalUnit's id, establishing the hierarchy. A null parentUnitId indicates a root-level organization.type (optional but recommended): A semantic label (e.g., "Organization", "Branch", "Department", "SubDepartment") used for UI presentation and specific business logic, but not for enforcing the hierarchy itself. The hierarchy is purely determined by parentUnitId. If a unit's classification changes, its type attribute is updated accordingly.Example Hierarchy:graph TD
    Org_A[Acme Corp (Org Type)]
    Branch_1[Addis Branch (Branch Type)]
    Branch_2[New York Branch (Branch Type)]
    Dept_A[Addis HR (Dept Type)]
    Dept_B[Addis Sales (Dept Type)]
    SubDept_C[Sales - East (SubDept Type)]

    Org_A --> Branch_1
    Org_A --> Branch_2
    Branch_1 --> Dept_A
    Branch_1 --> Dept_B
    Dept_B --> SubDept_C
Multi-Tenancy: Root Organization as TenantA crucial aspect of this ERP is its multi-tenancy capability, where each root-level OrganizationalUnit functions as a distinct tenant.Tenant Identification: The id of a root OrganizationalUnit (where parentUnitId is null) serves as the unique tenantId for all data belonging to that organization.Data Segregation: Every entity that holds tenant-specific data (e.g., Users, Roles, Permissions, Workflows, Budget Plans) includes a tenantId column.Automatic Filtering:During authentication, the authenticated user's tenantId is extracted (which corresponds to their root organization's id).This tenantId is stored in a request-scoped TenantContext.A TypeORM TenantAwareSubscriber intercepts all database queries for tenant-aware entities. It automatically injects a WHERE tenantId = :currentTenantId clause, ensuring that users only access data relevant to their organization.During insertion, the TenantAwareSubscriber automatically populates the tenantId for new tenant-aware entities from the TenantContext, preventing accidental cross-tenant data creation.Multi-Tenancy Data Flow:graph TD
    Client[Client Application]
    AuthRequest(Login/API Call)
    AuthGuard[Authentication Guard]
    JWT[JWT (contains userId, tenantId)]
    TenantContext[Request-Scoped TenantContext]
    Service[Application Service]
    Repository[TypeORM Repository]
    TenantAwareSubscriber[TenantAwareSubscriber]
    Database[Database]

    Client -- API Request --> AuthRequest
    AuthRequest -- Verify Token --> AuthGuard
    AuthGuard -- Extract Tenant ID & isSuperAdmin --> TenantContext
    AuthGuard -- Allow Access --> Service
    Service -- Call Repository Method --> Repository
    Repository -- Query Pre-processing --> TenantAwareSubscriber
    TenantAwareSubscriber -- Inject WHERE tenantId / Bypass if Super Admin --> Database
    Database -- Filtered/Unfiltered Data --> TenantAwareSubscriber
    TenantAwareSubscriber -- Return Data --> Repository
    Repository -- Return Data --> Service
    Service -- Return Data --> Client
Roles, Permissions, and Access ControlThe system implements a robust Role-Based Access Control (RBAC) mechanism.Permissions: The most granular level, defining specific actions (View, Create, Update, Delete, Approve, Reject) for features (e.g., "Budget Plan", "User Management").Roles: Collections of Permissions. Roles provide a logical grouping of authorizations (e.g., "Budget Preparer", "Department Head", "Finance Manager").Users: Each user is assigned a single primary Role and belongs to a specific OrganizationalUnit. Access checks leverage the user's role and their organizational context.Dynamic WorkflowsWorkflows enable multi-stage approval processes that can be customized to any depth.Workflow Definition: A template for a specific workflow (e.g., "Budget Plan Approval").Workflow Step Definition: Defines individual stages within a workflow, including:stepOrder: The sequence of the step.requiredRoleIds: Roles eligible to approve this step.requiredOrganizationalUnitIds: Specific organizational units whose members are eligible.requiredPermissionIds: Permissions needed to perform the action at this step.Workflow Instance: Represents an actual item (e.g., a specific Budget Plan) moving through an approval process.Workflow Task: Records individual approval/rejection actions taken by users at specific steps.Simplified Workflow Process:graph TD
    A[Start: User Submits Item] --> B{Item Enters Workflow}
    B --> C[Workflow Instance Created]
    C --> D[Current Step: Step 1 (Department Head Approval)]
    D -- User with Role/Unit approves --> E{All Required Approvals for Step 1?}
    E -- Yes --> F[Next Step: Step 2 (Finance Approval)]
    E -- No --> D
    F -- User with Role/Unit approves --> G{All Required Approvals for Step 2?}
    G -- Yes --> H[Workflow Completed: Item Approved]
    G -- No --> F
    F -- Rejection/Revision --> I[Workflow Status: Rejected/Needs Revision]
Super Admin FunctionalityA powerful "Super Admin" account exists with unique capabilities:Global Visibility: The super admin can view all data across all tenants. This is achieved by the TenantAwareSubscriber checking an isSuperAdmin flag in the TenantContext and bypassing tenantId filtering for super admin queries.Explicit Data Assignment: When a super admin creates or modifies tenant-specific data, they must explicitly provide the target tenantId in the request payload. This prevents accidental data assignment and ensures conscious management.Tenant Setup: The super admin is responsible for creating initial root-level OrganizationalUnits (new tenants) and their first administrator users, thus setting the foundation for each tenant's isolated data.Ensuring Data Integrity: Cycle DetectionTo prevent logical errors and infinite loops in hierarchical structures (like OrganizationalUnits, or any other data with parent-child relationships), the system employs a generic cycle detection mechanism.A GraphCycleDetectorService implements a Depth-First Search (DFS) algorithm.This service can be injected into any module that manages hierarchical data.When a new parent-child relationship is proposed (e.g., creating a new department under an existing one, or re-parenting a branch), the service checks if this change would create a circular dependency. If a cycle is detected, the operation is rejected, maintaining data integrity.Future EnhancementsSeeder: Implementation of database seeders for populating initial data for development and testing environments, including setting up initial super admin accounts and a sample tenant structure.