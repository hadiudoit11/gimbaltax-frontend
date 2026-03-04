# AgentResearchResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**session_id** | **string** |  | [optional] [default to undefined]
**query** | **string** | Original research query submitted | [optional] [default to undefined]
**success** | **boolean** | Whether the research was successful | [optional] [default to undefined]
**agent_category** | **string** | Which specialized agent handled the research: - Pennsylvania: PA-specific tax research agent   - New York: NY-specific tax research agent - Federal: Federal tax research agent (FICA, FUTA, etc.) - State Taxes: Query was classified as state tax research - Minimum Wages: Query was classified as minimum wage research   - Unknown: Classification or routing failed  | [optional] [default to undefined]
**taxes_found** | **number** | Number of taxes discovered by the agent | [optional] [default to undefined]
**taxes_converted** | **number** | Number of taxes successfully converted to unified schema | [optional] [default to undefined]
**converted_taxes** | [**Array&lt;TaxPayload&gt;**](TaxPayload.md) | Raw tax data in unified schema format | [optional] [default to undefined]
**validation_errors** | [**Array&lt;ValidationError&gt;**](ValidationError.md) | Errors encountered during validation | [optional] [default to undefined]
**pending_configs** | [**Array&lt;PendingTaxConfig&gt;**](PendingTaxConfig.md) | Database records created and ready for approval workflow | [optional] [default to undefined]
**raw_agent_response** | [**AgentResearchResultRawAgentResponse**](AgentResearchResultRawAgentResponse.md) |  | [optional] [default to undefined]
**started_at** | **string** | When the research session started | [optional] [default to undefined]
**completed_at** | **string** | When the research session completed | [optional] [default to undefined]
**error** | **string** | Error message if success is false | [optional] [default to undefined]

## Example

```typescript
import { AgentResearchResult } from './api';

const instance: AgentResearchResult = {
    session_id,
    query,
    success,
    agent_category,
    taxes_found,
    taxes_converted,
    converted_taxes,
    validation_errors,
    pending_configs,
    raw_agent_response,
    started_at,
    completed_at,
    error,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
