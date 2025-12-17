# SAP Sales and Service Cloud V2 Table Layout Prompt

Use this template when requesting table-based interfaces. The GitHub Copilot instructions contain all design system details.

## Basic Request Template

I need a **[Entity Name]** management interface following our SAP Sales and Service Cloud V2 design system.

### Data Structure
**Table Columns:**
- Column 1: [Name] ([Data Type]) - [Description/Notes]
- Column 2: [Name] ([Data Type]) - [Description/Notes]
- Column 3: [Name] ([Data Type]) - [Description/Notes]
- [Continue as needed...]

**Data Types:**
- `text` - Standard text input
- `email` - Email validation
- `url` - Website with https:// placeholder  
- `tel` - Phone number
- `number` - Numeric input, right-aligned
- `currency` - Money format ($X.XM/K)
- `date` - Date picker
- `dropdown` - Select from options
- `boolean-switch` - Toggle switch
- `priority` - Colored toggle buttons (High=Red, Medium=Yellow, Low=Blue)
- `status` - Radio buttons or badges
- `category` - Dropdown or radio group

### Modal Form
**Fields needed in Add/Edit modal:**
- [List fields that should appear in the form]
- [Specify any field-specific requirements]
- [Note required vs optional fields]

### Functionality Requirements
- ✅ **Search/Filter**: [Specify searchable fields]
- ✅ **Sorting**: [Specify sortable columns]
- ✅ **Actions**: Add new, Edit, Delete, [Other actions]
- ✅ **Validation**: [Required fields, formats, constraints]

### Backend Integration
**API Endpoints:**
```javascript
// GET all records
fetch('/api/[entities]')
  .then(response => response.json())
  .then(data => populateTable(data));

// POST new record  
fetch('/api/[entities]', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// PUT update record
fetch(`/api/[entities]/${id}`, {
  method: 'PUT', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// DELETE record
fetch(`/api/[entities]/${id}`, { method: 'DELETE' });
```

**Data Format:**
```json
{
  "id": "string|number",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Special Requirements
- [Any color coding rules]
- [Custom business logic]
- [Integration requirements]
- [Performance considerations]

---

## Example: Customer Accounts

I need a **Customer Account** management interface following our SAP Sales and Service Cloud V2 design system.

### Data Structure
**Table Columns:**
- Account ID: `text` - Auto-generated, read-only in form
- Company Name: `text` - Required, main identifier
- Contact Person: `text` - Required, primary contact
- Email: `email` - Required, with validation
- Phone: `tel` - Optional, formatted display
- Website: `url` - Optional, opens in new tab
- Industry: `dropdown` - Required, predefined categories
- Annual Revenue: `currency` - Optional, formatted as $X.XM/K
- Active Status: `boolean-switch` - Account active/inactive
- Priority Level: `priority` - High/Medium/Low with color coding
- Account Status: `status` - Active/Review/Inactive (radio buttons)

### Modal Form
**Fields needed in Add/Edit modal:**
- All table columns in same order
- Account ID auto-generated on create, read-only on edit
- Industry dropdown with: Manufacturing, Technology, Healthcare, Finance, etc.
- Priority defaults to Medium
- Status defaults to Active

### Functionality Requirements  
- ✅ **Search/Filter**: All text fields, company name primary
- ✅ **Sorting**: All columns except switches/buttons
- ✅ **Actions**: Add new account, inline priority editing
- ✅ **Validation**: Required fields marked with *, email format, URL format

### Backend Integration
**API Endpoints:**
```javascript
// GET /api/accounts - List all accounts
// POST /api/accounts - Create new account  
// PUT /api/accounts/{id} - Update account
// DELETE /api/accounts/{id} - Delete account
```

**Account Data Model:**
```json
{
  "id": "ACC-1001",
  "companyName": "Acme Corporation", 
  "contactPerson": "John Smith",
  "email": "john.smith@acme.com",
  "phone": "+1-555-0123",
  "website": "https://www.acme-corp.com",
  "industry": "manufacturing",
  "revenue": 2500000,
  "active": true,
  "priority": "high", 
  "status": "active",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Special Requirements
- Row state indicators: Green=Active, Red=Inactive, Orange=Review, Blue=Info
- Priority color coding: Red=High, Yellow=Medium, Blue=Low
- Revenue displays as $2.5M, $850K format in table
- Website links open in new tab with proper security attributes