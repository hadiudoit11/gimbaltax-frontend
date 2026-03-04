# AgentStreamEvent


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [default to undefined]
**timestamp** | **string** |  | [default to undefined]
**message** | **string** |  | [default to undefined]
**agent** | **string** | Which professional agent is currently working: - classify: Second-tier classification (Federal/NY/PA routing) - classify1: First-tier classification (State Taxes vs Minimum Wages)   - pennsylvania: Pennsylvania tax research agent - new_york: New York tax research agent - federal: Federal tax research agent - cleaner_upper: Result standardization and cleanup agent  | [optional] [default to undefined]
**progress** | **number** | Progress percentage | [optional] [default to undefined]
**data** | **{ [key: string]: any; }** | Additional event-specific data | [optional] [default to undefined]

## Example

```typescript
import { AgentStreamEvent } from './api';

const instance: AgentStreamEvent = {
    type,
    timestamp,
    message,
    agent,
    progress,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
