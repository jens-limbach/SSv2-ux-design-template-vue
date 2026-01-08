import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
// Also parse application/merge-patch+json as JSON (required for PATCH requests)
app.use(express.json({ type: 'application/merge-patch+json' }))

// SAP CRM API Configuration
const CRM_BASE_URL = process.env.CRM_BASE_URL
const CRM_USERNAME = process.env.CRM_USERNAME
const CRM_PASSWORD = process.env.CRM_PASSWORD

// Validate required environment variables
if (!CRM_BASE_URL || !CRM_USERNAME || !CRM_PASSWORD) {
  console.error('❌ ERROR: Missing required environment variables!')
  console.error('Please ensure the following are set in server/.env:')
  console.error('  - CRM_BASE_URL')
  console.error('  - CRM_USERNAME')
  console.error('  - CRM_PASSWORD')
  console.error('\nSee server/env-template.txt for configuration template.')
  process.exit(1)
}

// Create Basic Auth header
const authString = `${CRM_USERNAME}:${CRM_PASSWORD}`
const authHeader = 'Basic ' + Buffer.from(authString).toString('base64')

// Log successful configuration (without exposing credentials)
console.log(`✅ CRM API configured: ${CRM_BASE_URL}`)
console.log(`✅ Username: ${CRM_USERNAME}`)

// Helper function to make CRM API requests
async function crmRequest(endpoint, options = {}) {
  const url = `${CRM_BASE_URL}${endpoint}`
  
  // Set appropriate Content-Type based on method
  const contentType = options.method === 'PATCH' 
    ? 'application/merge-patch+json' 
    : 'application/json'
  
  const finalHeaders = {
    'Authorization': authHeader,
    'Content-Type': contentType,
    ...options.headers
  }
  
  const response = await fetch(url, {
    ...options,
    headers: finalHeaders
  })
  
  if (!response.ok) {
    console.log(`[CRM API] ${options.method || 'GET'} ${url}`)
    console.log(`[CRM API] Response status: ${response.status} ${response.statusText}`)
    const errorText = await response.text()
    console.error(`[CRM API] Error response: ${errorText}`)
    throw new Error(`CRM API Error: ${response.status} - ${errorText}`)
  }
  
  return response
}

// Proxy endpoints

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const { $top, $skip, $orderby, $filter, $count, $select, $search } = req.query
    
    // Build query string
    const params = new URLSearchParams()
    if ($top) params.append('$top', $top)
    if ($skip) params.append('$skip', $skip)
    if ($orderby) params.append('$orderby', $orderby)
    if ($filter) params.append('$filter', $filter)
    if ($count) params.append('$count', $count)
    if ($select) params.append('$select', $select)
    if ($search) params.append('$search', $search)
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await crmRequest(`/sap/c4c/api/v1/account-service/accounts${queryString}`)
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single account by ID
app.get('/api/accounts/:id', async (req, res) => {
  try {
    // Build query string (including cache buster if present)
    const queryString = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString()
      : ''
    
    const response = await crmRequest(`/sap/c4c/api/v1/account-service/accounts/${req.params.id}${queryString}`)
    const data = await response.json()
    
    // Disable caching for this response
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.json(data)
  } catch (error) {
    console.error('Error fetching account:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create new account
app.post('/api/accounts', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/account-service/accounts', {
      method: 'POST',
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating account:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update account
app.patch('/api/accounts/:id', async (req, res) => {
  try {
    const ifMatch = req.headers['if-match']
    
    if (!ifMatch) {
      return res.status(400).json({ error: 'If-Match header is required for updates' })
    }
    
    console.log('========== PATCH REQUEST ==========')
    console.log('[PATCH] Account ID:', req.params.id)
    console.log('[PATCH] Payload:', JSON.stringify(req.body, null, 2))
    console.log('[PATCH] If-Match:', ifMatch)
    console.log('===================================')
    
    // SAP CRM expects the If-Match value to be wrapped in quotes (ETag format)
    const quotedIfMatch = `"${ifMatch}"`
    
    const response = await crmRequest(`/sap/c4c/api/v1/account-service/accounts/${req.params.id}`, {
      method: 'PATCH',
      headers: {
        'If-Match': quotedIfMatch
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error updating account:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete account
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    await crmRequest(`/sap/c4c/api/v1/account-service/accounts/${req.params.id}`, {
      method: 'DELETE'
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting account:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get industrial sectors (for Industry dropdown)
app.get('/api/industrial-sectors', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/business-partner-service/industrialSectors')
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching industrial sectors:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get contact persons (for Contact Person dropdown)
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/contact-person-service/contactPersons?$top=100')
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get employees (for Owner dropdown)
app.get('/api/employees', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/employee-service/employees?$top=100')
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching employees:', error)
    res.status(500).json({ error: error.message })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`CRM Base URL: ${CRM_BASE_URL}`)
  console.log(`CRM Username: ${CRM_USERNAME}`)
  console.log(`CRM Password: ${CRM_PASSWORD ? '***' + CRM_PASSWORD.slice(-2) : 'NOT SET'}`)
  console.log(`Auth Header (base64): ${authHeader.substring(0, 20)}...`)
})
