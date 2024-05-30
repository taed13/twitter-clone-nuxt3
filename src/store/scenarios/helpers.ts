// シナリオに関する使い回すhelperメソッドを定義する
// 将来的にはcomposable辺りになるかもしれない

import type {
  ContactRouteConditionParams,
  ContactRouteConditions,
  CustomerConditionParams,
  CustomerConditions,
} from '~/types/scenarios'
import type * as State from '~/types/scenarios/state'

interface ParseConditionsResult {
  logicalOperator: State.LogicalOperator
  contactRouteConditions: State.ContactRouteConditions
  customerConditions: State.CustomerConditions
  contactRoute: State.ContactRoute
}

interface GenerateConditionsResult {
  contactRouteConditions: ContactRouteConditions
  customerConditions: CustomerConditions
}

// オブジェクト形式のデータをstateにセットするためにパースする
export const parseConditions = ({
  contactRouteConditions,
  customerConditions = {},
}: {
  contactRouteConditions: ContactRouteConditions
  customerConditions: CustomerConditions
}): ParseConditionsResult => {
  const operatorContactRoute: State.LogicalOperator = contactRouteConditions.and ? 'and' : 'or'
  const operatorCustomer: State.LogicalOperator = customerConditions && customerConditions.and ? 'and' : 'or'

  // contactRouteConditionsからデータを抽出し配列にセットしていく
  const _contactRouteConditions: State.ContactRouteConditions = []
  contactRouteConditions[operatorContactRoute]?.forEach((condition) => {
    for (const key in condition) {
      const _key = key as State.ContactRouteConditions[number]['key']
      const _obj = condition[_key] as ContactRouteConditionParams
      _contactRouteConditions.push({
        key: _key,
        value: _obj.value,
      })
    }
  })

  // customerConditionsからデータを抽出し配列にセットしていく
  const _customerConditions: State.CustomerConditions = []
  if (customerConditions) {
    customerConditions[operatorCustomer]?.forEach((condition) => {
      for (const key in condition) {
        const _key = key as State.CustomerConditions[number]['key']
        const _obj = condition[_key] as CustomerConditionParams
        _customerConditions.push({
          key: _key,
          operator: _obj.operator,
          value: _obj.value,
        })
      }
    })
  }

  // contactRouteConditionsからcontactRouteを算出する（現状すべて同じルート）
  let _contactRoute: State.ContactRoute = 'posts'
  if (_contactRouteConditions[0].key.split('.')[0] === 'customer_posts') {
    _contactRoute = 'posts'
  }
  if (_contactRouteConditions[0].key.split('.')[0] === 'customer_appointments') {
    _contactRoute = 'appointments'
  }
  if (_contactRouteConditions[0].key.split('.')[0] === 'customer_order_items') {
    _contactRoute = 'orderItems'
  }
  if (_contactRouteConditions[0].key.split('.')[0] === 'customer_groups_customers') {
    _contactRoute = 'customerGroups'
  }
  return {
    // 現状基本オペレーターはcontactRouteConditionsのを使う
    logicalOperator: operatorContactRoute,
    contactRouteConditions: _contactRouteConditions,
    customerConditions: _customerConditions,
    contactRoute: _contactRoute,
  }
}

// stateの各データからオブジェクト形式のデータを生成する
export const generateConditions = ({
  logicalOperator,
  contactRouteConditions,
  customerConditions,
}: {
  logicalOperator: State.LogicalOperator
  contactRouteConditions: State.ContactRouteConditions
  customerConditions: State.CustomerConditions
}): GenerateConditionsResult => {
  const _contactRouteConditions = contactRouteConditions.map((condition) => ({
    [condition.key]: {
      operator: '=',
      value: condition.value,
    },
  }))
  const _customerConditions = customerConditions.map((condition) => ({
    [condition.key]: {
      operator: condition.operator,
      value: condition.value,
    },
  }))

  const response: GenerateConditionsResult = {
    contactRouteConditions: { [logicalOperator]: _contactRouteConditions },
    customerConditions: null,
  }
  if (_customerConditions.length > 0) {
    // 顧客条件は現状すべてAND検索にする
    response.customerConditions = { and: _customerConditions }
  }
  return response
}
