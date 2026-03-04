# JurisdictionCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**jurisdiction_type** | [**JurisdictionType**](JurisdictionType.md) |  | [default to undefined]
**locality_type** | [**LocalityType**](LocalityType.md) |  | [optional] [default to undefined]
**parent** | **string** | Parent jurisdiction ID | [optional] [default to undefined]
**is_active** | **boolean** |  | [optional] [default to true]

## Example

```typescript
import { JurisdictionCreate } from './api';

const instance: JurisdictionCreate = {
    code,
    name,
    jurisdiction_type,
    locality_type,
    parent,
    is_active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
