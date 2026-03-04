# PendingTaxConfig

Tax configuration awaiting approval. These records persist in the database  until explicitly approved or rejected (no cache dependency). 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Database ID for approval/rejection operations | [optional] [default to undefined]
**tax_id** | **string** | Business identifier for the tax | [optional] [default to undefined]
**name** | **string** | Human-readable tax name | [optional] [default to undefined]
**category** | [**TaxCategory**](TaxCategory.md) |  | [optional] [default to undefined]
**jurisdiction** | [**PendingTaxConfigJurisdiction**](PendingTaxConfigJurisdiction.md) |  | [optional] [default to undefined]
**status** | **string** | Current status of the configuration (always draft for pending configs) | [optional] [default to undefined]
**validation_status** | **string** | Result of schema validation | [optional] [default to undefined]
**validation_messages** | **Array&lt;string&gt;** | Validation error messages if any | [optional] [default to undefined]
**error** | **string** | Error message if status is \&#39;error\&#39; | [optional] [default to undefined]
**agent_session_id** | **string** | ID of the research session that created this config | [optional] [default to undefined]
**created_by** | [**User**](User.md) |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { PendingTaxConfig } from './api';

const instance: PendingTaxConfig = {
    id,
    tax_id,
    name,
    category,
    jurisdiction,
    status,
    validation_status,
    validation_messages,
    error,
    agent_session_id,
    created_by,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
