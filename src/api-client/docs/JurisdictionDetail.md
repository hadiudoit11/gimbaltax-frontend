# JurisdictionDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**jurisdiction_type** | [**JurisdictionType**](JurisdictionType.md) |  | [optional] [default to undefined]
**locality_type** | [**LocalityType**](LocalityType.md) |  | [optional] [default to undefined]
**parent** | **string** | Parent jurisdiction ID | [optional] [default to undefined]
**is_active** | **boolean** |  | [optional] [default to undefined]
**tax_configs_count** | **number** | Number of tax configurations in this jurisdiction | [optional] [default to undefined]
**children** | [**Array&lt;Jurisdiction&gt;**](Jurisdiction.md) |  | [optional] [default to undefined]
**parent_details** | [**Jurisdiction**](Jurisdiction.md) |  | [optional] [default to undefined]
**tax_configs** | [**Array&lt;TaxConfig&gt;**](TaxConfig.md) |  | [optional] [default to undefined]

## Example

```typescript
import { JurisdictionDetail } from './api';

const instance: JurisdictionDetail = {
    created_at,
    updated_at,
    id,
    code,
    name,
    jurisdiction_type,
    locality_type,
    parent,
    is_active,
    tax_configs_count,
    children,
    parent_details,
    tax_configs,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
