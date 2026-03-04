# EventResearchResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**session_id** | **string** |  | [optional] [default to undefined]
**query** | **string** |  | [optional] [default to undefined]
**success** | **boolean** |  | [optional] [default to undefined]
**events_found** | **number** | Number of events discovered by AI | [optional] [default to undefined]
**events_converted** | **number** | Number of events successfully created | [optional] [default to undefined]
**converted_events** | **Array&lt;{ [key: string]: any; }&gt;** | Raw event data from AI | [optional] [default to undefined]
**validation_errors** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**pending_events** | [**Array&lt;PendingComplianceEvent&gt;**](PendingComplianceEvent.md) | Database records created and ready for approval | [optional] [default to undefined]
**raw_agent_response** | **{ [key: string]: any; }** | Complete unprocessed response from AI agent | [optional] [default to undefined]
**started_at** | **string** |  | [optional] [default to undefined]
**completed_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { EventResearchResult } from './api';

const instance: EventResearchResult = {
    session_id,
    query,
    success,
    events_found,
    events_converted,
    converted_events,
    validation_errors,
    pending_events,
    raw_agent_response,
    started_at,
    completed_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
