## **Features**

This ERP backend is built with extensibility and adaptability at its core, offering:

* **Flexible Organizational Structure:** Define and manage complex, non-uniform organizational hierarchies (departments, sub-departments, branches, centers, etc.) using a generic "Organizational Unit" concept.  
* **Multi-Tenancy:** Securely segregates data for different organizations, treating each root-level organization as an independent tenant.  
* **Role-Based Access Control (RBAC):** Granular permission management where permissions (feature \+ action) are grouped into roles, and roles are assigned to users.  
* **Dynamic Workflow Engine:** Define multi-stage approval processes with configurable criteria (roles, organizational units) and an arbitrary number of steps.  
* **Super Admin Oversight:** A specialized super admin account with global visibility and management capabilities across all tenants, while maintaining strict data isolation for regular tenant users.  
* **Data Integrity:** Implements mechanisms to prevent circular dependencies in hierarchical data structures.  
* **Robust Configuration:** Utilizes Zod for strict validation of environment variables, ensuring application stability.
