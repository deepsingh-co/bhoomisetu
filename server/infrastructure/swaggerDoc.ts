// Feature 34: API Documentation Portal (OpenAPI 3.0 Specification)

export const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'BhoomiSetu — National Land Records Intelligence Engine API',
    version: '3.0.0-PROD',
    description: 'Enterprise REST & AI Microservices API powering National Land Records Intelligence, DILRMP compliance, PostGIS spatial queries, and multi-agent AI verification for the Government of India.',
    contact: {
      name: 'National Informatics Centre (NIC) & Department of Land Resources (DoLR)',
      url: 'https://dolr.gov.in',
      email: 'support@bhoomisetu.gov.in',
    },
  },
  servers: [
    { url: '/api', description: 'Primary API Gateway Gateway' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'System and Container Health Status',
        description: 'Returns real-time operational status of backend, PostgreSQL, Redis, Qdrant, and Ollama.',
        responses: {
          '200': {
            description: 'Health status object',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/metrics': {
      get: {
        summary: 'Prometheus Telemetry Metrics',
        description: 'Standard Prometheus text format metrics for scrape target integration.',
        responses: {
          '200': {
            description: 'Prometheus metrics',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/infra/ai/run': {
      post: {
        summary: 'Execute Local Ollama / AI Model Inference',
        description: 'Runs prompt through selected local model with caching, GPU acceleration, and retry handling.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  model: { type: 'string', example: 'llama3:8b' },
                  prompt: { type: 'string', example: 'Analyze deed conveyance clauses for encumbrances.' },
                  jsonMode: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Inference result with latency and token usage metrics.' },
        },
      },
    },
    '/infra/ocr/process': {
      post: {
        summary: 'Process Document via OCR Pipeline Engine',
        description: 'Dual-pass PaddleOCR + TrOCR handwritten field extraction with bounding box coordinates.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  documentId: { type: 'string' },
                  state: { type: 'string', example: 'MH' },
                  languageHint: { type: 'string', example: 'mr' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Extracted fields, layout detection, and explainability metrics.' },
        },
      },
    },
    '/infra/vector/search': {
      post: {
        summary: 'Semantic Vector Search via Qdrant',
        description: 'Cosine similarity vector query across cadastres, mutation records, and land laws.',
        responses: { '200': { description: 'Top K retrieved embeddings with similarity scores.' } },
      },
    },
    '/infra/rag/query': {
      post: {
        summary: 'Land Law RAG Engine Query',
        description: 'Retrieval-Augmented Generation retrieving applicable sections from MLRC 1966, UP Revenue Code, and statutory rules.',
        responses: { '200': { description: 'Grounded legal explanation with statutory citations.' } },
      },
    },
    '/infra/fraud/analyze': {
      post: {
        summary: 'Multi-Signal Fraud Analysis Engine',
        description: 'Computes fraud risk score (0-100), duplicate deed hashes, and seal/signature similarity.',
        responses: { '200': { description: 'Fraud analysis report and recommended administrative action.' } },
      },
    },
    '/infra/dispute/analyze': {
      post: {
        summary: 'Dispute Risk Prediction Engine',
        description: 'Rule-based + AI risk analysis evaluating boundary discrepancies, co-sharer succession, and loan encumbrance.',
        responses: { '200': { description: 'Dispute probability score, risk factors, and recommendations.' } },
      },
    },
    '/infra/reports/generate': {
      post: {
        summary: 'Generate Certified Government Land Report',
        description: 'Generates PDF/Excel/CSV reports with official digital signature and tamper-evident QR code.',
        responses: { '200': { description: 'Report metadata and download URI.' } },
      },
    },
  },
};
