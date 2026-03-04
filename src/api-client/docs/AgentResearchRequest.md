# AgentResearchRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**query** | **string** | Natural language description of tax research needed | [default to undefined]
**effective_date** | **string** | When the taxes should become effective (defaults to today) | [optional] [default to undefined]
**auto_approve** | **boolean** | Whether to automatically approve valid tax configurations | [optional] [default to false]

## Example

```typescript
import { AgentResearchRequest } from './api';

const instance: AgentResearchRequest = {
    query,
    effective_date,
    auto_approve,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
