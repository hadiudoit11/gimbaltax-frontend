# AgentResearchApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**agentsResearchPost**](#agentsresearchpost) | **POST** /agents/research/ | Start agent tax research|
|[**agentsResultsSessionIdGet**](#agentsresultssessionidget) | **GET** /agents/results/{session_id}/ | Get agent research results|
|[**agentsSessionsGet**](#agentssessionsget) | **GET** /agents/sessions/ | List agent research sessions|
|[**agentsStreamSessionIdGet**](#agentsstreamsessionidget) | **GET** /agents/stream/{session_id}/ | Stream agent research progress|

# **agentsResearchPost**
> AgentSessionResponse agentsResearchPost(agentResearchRequest)

Initiate AI-powered tax research with natural language query using OpenAI agents.  **Database Persistence**: This endpoint ALWAYS creates TaxConfig records  with `status=\'draft\'` in the database that require approval/rejection. These pending configurations persist until explicitly approved or rejected.  **Real-time Workflow**:  1. Returns session_id immediately (202 response) 2. Professional OpenAI agents process query in background with SSE streaming 3. Two-tier classification routes to specialized tax research agents 4. Agents search official government websites with web search tools 5. Complex field parsing and normalization converts agent responses to unified schema 6. Creates draft TaxConfig records in database for any valid taxes found 7. Use `/agents/stream/{session_id}/` for live progress updates 8. Use `/agents/results/{session_id}/` for final results summary 9. Use `/tax-configs/pending/` to view all pending configs awaiting approval  **Professional OpenAI Agents Architecture**: - **Classification**: First classifies query as \"State Taxes\" vs \"Minimum Wages\" - **Routing**: For State Taxes, routes to Federal, Pennsylvania, or New York agents - **Specialized Agents**: Each agent has domain expertise and official website access - **Web Search**: Agents use WebSearchTool with government domain filtering - **Structured Output**: Pydantic schemas ensure consistent tax data format - **Field Normalization**: Converts complex agent responses to schema-compliant format - **Rate Parsing**: Handles complex rates like \"Experience-rated: 2.1% to 9.9%\" → 2.1% - **Validation**: Full schema validation before creating database records - **Fallback**: Creates pending configs even when agents fail (with error details)  **Example Agent Responses**: - Pennsylvania: Returns SUI taxes with rates 1.419% to 10.3734%, $10,000 wage base - New York: Returns 4+ taxes (SUI, MCTMT, PFL, SDI) with detailed requirements - Federal: Returns FICA components (Social Security 12.4%, Medicare 2.9%)  **Agent Capabilities & Examples**: ``` Query: \"Pennsylvania payroll taxes 2025\" → classify1: \"State Taxes\" → classify: \"Pennsylvania\" → pennsylvania agent → Returns: SUI taxes with rates 1.419% to 10.3734%, $10,000 wage base, Form UC-657  Query: \"New York Long Island taxes\"   → classify1: \"State Taxes\" → classify: \"New York\" → new_york agent → Returns: 4+ taxes (SUI 2.1-9.9%, MCTMT 0.055%, PFL 0.388%, SDI, etc.)  Query: \"Federal FICA taxes 2025\" → classify1: \"State Taxes\" → classify: \"Federal\" → federal agent   → Returns: Social Security 12.4%, Medicare 2.9%, wage bases, Form 941 ```  **Field Parsing & Normalization**: - Rate: \"Experience-rated: 2.1% to 9.9%\" → extracts 2.1% for calculations - Collection: \"Both\" → [\"employer\", \"employee\"] array format - Frequency: \"Quarterly (< $300 per quarter), Monthly ($300–$999)...\" → \"quarterly\" - Complex data preserved in `rate_description` field for human review  **Result**: Every research session creates database-persisted draft tax configs for approval. 

### Example

```typescript
import {
    AgentResearchApi,
    Configuration,
    AgentResearchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentResearchApi(configuration);

let agentResearchRequest: AgentResearchRequest; //

const { status, data } = await apiInstance.agentsResearchPost(
    agentResearchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **agentResearchRequest** | **AgentResearchRequest**|  | |


### Return type

**AgentSessionResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**202** | Research session started successfully, draft configs created in database |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **agentsResultsSessionIdGet**
> AgentResearchResult agentsResultsSessionIdGet()

Retrieve final results from completed agent research session.  **Important**: The `pending_configs` array in the response contains database  record IDs that can be used with approval endpoints. However, for the most  up-to-date list of pending configurations, use `/tax-configs/pending/`  which queries the database directly.  **Persistence**: Draft TaxConfig records created by this session persist  in the database regardless of cache expiration. 

### Example

```typescript
import {
    AgentResearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentResearchApi(configuration);

let sessionId: string; //Agent research session ID (default to undefined)

const { status, data } = await apiInstance.agentsResultsSessionIdGet(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Agent research session ID | defaults to undefined|


### Return type

**AgentResearchResult**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Agent research results with database-persisted pending configs |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **agentsSessionsGet**
> PaginatedAgentSessions agentsSessionsGet()

Get list of agent research sessions for current user

### Example

```typescript
import {
    AgentResearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentResearchApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let status: AgentSessionStatus; //Filter by session status (optional) (default to undefined)

const { status, data } = await apiInstance.agentsSessionsGet(
    page,
    pageSize,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **status** | **AgentSessionStatus** | Filter by session status | (optional) defaults to undefined|


### Return type

**PaginatedAgentSessions**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Agent research sessions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **agentsStreamSessionIdGet**
> AgentStreamEvent agentsStreamSessionIdGet()

Server-Sent Events (SSE) stream providing real-time agent progress updates.  **Event Types**: - `status`: General status updates and progress messages - `progress`: Numeric progress percentage (0-100) - `agent_start`: Agent begins processing query - `classification`: Query classification and routing decisions - `search`: Web searching official government sources (IRS, pa.gov, ny.gov) - `generation`: Agent generating structured tax data - `validation`: Converting and validating agent responses - `complete`: Research finished, draft configs created in database - `error`: Agent failed with error details and fallback handling  **Usage**: Connect immediately after receiving session_id from research endpoint. Stream provides live updates as agent processes query and creates pending configs. 

### Example

```typescript
import {
    AgentResearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentResearchApi(configuration);

let sessionId: string; //Agent research session ID (default to undefined)

const { status, data } = await apiInstance.agentsStreamSessionIdGet(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Agent research session ID | defaults to undefined|


### Return type

**AgentStreamEvent**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/event-stream, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | SSE stream of agent progress events |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

