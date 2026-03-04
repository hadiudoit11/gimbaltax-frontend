# AgentSession


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**session_id** | **string** |  | [optional] [default to undefined]
**query** | **string** |  | [optional] [default to undefined]
**status** | [**AgentSessionStatus**](AgentSessionStatus.md) |  | [optional] [default to undefined]
**started_at** | **string** |  | [optional] [default to undefined]
**completed_at** | **string** |  | [optional] [default to undefined]
**user** | [**User**](User.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AgentSession } from './api';

const instance: AgentSession = {
    session_id,
    query,
    status,
    started_at,
    completed_at,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
