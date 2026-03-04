# AgentResearchResultRawAgentResponse

Complete unprocessed response from the professional OpenAI agent including: - `output_text`: Human-readable summary of findings - `output_parsed`: Structured Pydantic model output with taxes array - `category`: Final agent classification result   - `sdk_status`: Professional workflow completion status 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**output_text** | **string** | Human-readable agent findings summary | [optional] [default to undefined]
**output_parsed** | [**AgentResearchResultRawAgentResponseOutputParsed**](AgentResearchResultRawAgentResponseOutputParsed.md) |  | [optional] [default to undefined]
**category** | **string** | Final agent classification | [optional] [default to undefined]
**sdk_status** | **string** | Professional workflow status | [optional] [default to undefined]

## Example

```typescript
import { AgentResearchResultRawAgentResponse } from './api';

const instance: AgentResearchResultRawAgentResponse = {
    output_text,
    output_parsed,
    category,
    sdk_status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
