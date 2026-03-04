# AgentSessionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**session_id** | **string** |  | [optional] [default to undefined]
**status** | [**AgentSessionStatus**](AgentSessionStatus.md) |  | [optional] [default to undefined]
**query** | **string** |  | [optional] [default to undefined]
**stream_url** | **string** | URL for SSE stream of progress updates | [optional] [default to undefined]
**started_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AgentSessionResponse } from './api';

const instance: AgentSessionResponse = {
    session_id,
    status,
    query,
    stream_url,
    started_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
