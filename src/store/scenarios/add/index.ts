import type { ScenarioFull } from '~/types/scenarios'
import type * as State from '~/types/scenarios/state'
import { generateConditions } from '~/stores/scenarios/helpers'

type StepType = ScenarioFull['steps'][0]

// 初期値
const DEFAULT_LOGICAL_OPERATOR = 'and' as const
const DEFAULT_CONTACT_ROUTE = 'posts' as const
const DEFAULT_CONTACT_ROUTE_CONDITION_KEY = 'customer_posts.landing_page_id' as const

export const useScenariosAddStore = defineStore('scenariosAdd', () => {
  const flashMessage = useFlashMessage()
  const router = useRouter()

  // state
  const title = ref('' as ScenarioFull['title'])
  // 送信条件
  const logicalOperator = ref(DEFAULT_LOGICAL_OPERATOR as State.LogicalOperator)
  const contactRoute = ref(DEFAULT_CONTACT_ROUTE as State.ContactRoute)
  const contactRouteConditions = ref([
    {
      key: DEFAULT_CONTACT_ROUTE_CONDITION_KEY,
      value: 0,
    },
  ] as State.ContactRouteConditions)
  const customerConditions = ref([] as State.CustomerConditions)
  const sampleCustomers = ref(
    [] as {
      email: string
      name: string
    }[]
  )
  const allowSendSameCustomer = ref(false as ScenarioFull['allow_send_same_customer'])
  const allowSendAllCustomers = ref(false as ScenarioFull['allow_send_all_customers'])

  // メール設定（ステップ）
  const scenarioTypeId = ref(1 as ScenarioFull['scenario_type_id'])
  const steps = ref(
    [] as {
      subject: StepType['subject']
      mailContentId: StepType['mail_content_id']
      // serialNumber // addでは存在しない
      sendIntervalDays: StepType['send_interval_days']
      month: StepType['month']
      day: StepType['day']
      hour: StepType['hour']
      minute: StepType['minute']
      dayOfWeek: StepType['day_of_week']
      isActive: StepType['is_active']
      timestamp: number
    }[]
  )

  // 送信主情報
  const mailMagazineConfigId = ref(0 as ScenarioFull['mail_magazine_config_id'])

  // FYI: まだ複製時のパターンは考えない

  const errorMessage = ref('' as string)

  const currentContactRouteConditionKey = () => {
    if (contactRoute.value === 'posts') {
      return 'customer_posts.landing_page_id'
    }
    if (contactRoute.value === 'appointments') {
      return 'customer_appointments.reservation_id'
    }
    if (contactRoute.value === 'orderItems') {
      return 'customer_order_items.item_id'
    }
    if (contactRoute.value === 'customerGroups') {
      return 'customer_groups_customers.customer_group_id'
    }
  }

  // Action
  const init = () => {
    title.value = ''

    // 送信条件
    logicalOperator.value = DEFAULT_LOGICAL_OPERATOR
    contactRoute.value = DEFAULT_CONTACT_ROUTE
    contactRouteConditions.value = [
      {
        key: DEFAULT_CONTACT_ROUTE_CONDITION_KEY,
        value: 0,
      },
    ]
    customerConditions.value = []
    sampleCustomers.value = []
    allowSendSameCustomer.value = false
    allowSendAllCustomers.value = false

    // メール設定（ステップ）
    scenarioTypeId.value = 1
    steps.value = []

    // 送信主情報
    mailMagazineConfigId.value = 0

    // FYI: まだ複製時のパターンは考えない

    errorMessage.value = ''
  }

  const updateTitle = (value: string) => {
    title.value = value
  }

  // 送信条件
  const updateLogicalOperator = (val: State.LogicalOperator) => {
    logicalOperator.value = val
  }

  const updateContactRoute = (val: State.ContactRoute) => {
    contactRoute.value = val
  }

  // 送信条件: 流入経路
  const updateContactRouteConditions = (conditions: State.ContactRouteConditions) => {
    contactRouteConditions.value = conditions
  }

  const updateContactRouteCondition = ({
    index,
    value,
  }: {
    index: number
    value: State.ContactRouteConditions[number]['value']
  }) => {
    const condition = {
      key: currentContactRouteConditionKey(),
      value,
    } as State.ContactRouteConditions[number]

    contactRouteConditions.value.splice(index, 1, condition)
  }

  const addContactRouteCondition = () => {
    contactRouteConditions.value.push({
      key: currentContactRouteConditionKey(),
      value: 0,
    } as State.ContactRouteConditions[number])
  }

  const deleteContactRouteCondition = (index: number) => {
    contactRouteConditions.value.splice(index, 1)
  }

  // 送信条件: 顧客
  const updateCustomerCondition = ({
    index,
    condition,
  }: {
    index: number
    condition: State.CustomerConditions[number]
  }) => {
    customerConditions.value.splice(index, 1, condition)
  }

  const addCustomerCondition = () => {
    const condition = {
      key: '',
      operator: '=',
      value: '',
    } as unknown as State.CustomerConditions[number]
    customerConditions.value.push(condition)
  }

  const deleteCustomerCondition = (index: number) => {
    customerConditions.value.splice(index, 1)
  }

  // 送信条件: その他
  const updateAllowSendSameCustomer = (val: ScenarioFull['allow_send_same_customer']) => {
    allowSendSameCustomer.value = val
  }

  const updateAllowSendAllCustomers = (val: ScenarioFull['allow_send_all_customers']) => {
    allowSendAllCustomers.value = val
  }

  // メール設定（ステップ）
  const updateScenarioTypeId = (val: ScenarioFull['scenario_type_id']) => {
    scenarioTypeId.value = val
  }

  const updateStep = ({
    index,
    step,
  }: {
    index: number
    step: {
      subject: StepType['subject']
      mailContentId: StepType['mail_content_id']
      // serialNumber // addでは存在しない
      sendIntervalDays: StepType['send_interval_days']
      month: StepType['month']
      day: StepType['day']
      hour: StepType['hour']
      minute: StepType['minute']
      dayOfWeek: StepType['day_of_week']
      isActive: StepType['is_active']
      timestamp: number
    }[][number]
  }) => {
    steps.value.splice(index, 1, step)
  }

  const deleteStep = (index: number) => {
    steps.value.splice(index, 1)
  }

  const addStep = () => {
    const step = {
      subject: '',
      mailContentId: 0,
      sendIntervalDays: 0,
      month: null,
      day: null,
      hour: 10,
      minute: 0,
      dayOfWeek: null,
      isActive: false,
      timestamp: new Date().getTime(),
    }
    steps.value.push(step)
  }

  // 送信主情報
  const updateMailMagazineConfigId = (val: ScenarioFull['mail_magazine_config_id']) => {
    mailMagazineConfigId.value = val
  }

  // TODO: STEP: 今のconditionsからユーザーを検索する処理

  const sendTestMails = async () => {
    const mailContentIds = (
      steps.value as {
        subject: StepType['subject']
        mailContentId: StepType['mail_content_id']
        // serialNumber // addでは存在しない
        sendIntervalDays: StepType['send_interval_days']
        month: StepType['month']
        day: StepType['day']
        hour: StepType['hour']
        minute: StepType['minute']
        dayOfWeek: StepType['day_of_week']
        isActive: StepType['is_active']
        timestamp: number
      }[]
    )
      .filter((step) => step.mailContentId !== 0)
      .map((step) => step.mailContentId)

    try {
      await GqlSendTestMailScenario({
        input: {
          mail_content_ids: mailContentIds,
          mail_magazine_config_id: mailMagazineConfigId.value,
        },
      })

      flashMessage.init({
        message: 'テストメールを送信しました',
        color: 'success',
      })
    } catch (error: any) {
      if (error.gqlErrors) {
        let errMsg = 'テストメールの送信に失敗しました'
        if (error.gqlErrors[0].extensions.response) {
          errMsg = error.gqlErrors[0].extensions.response.body.message
        }
        flashMessage.init({
          message: errMsg,
          color: 'error',
        })
      }
    }
  }

  const save = async ({ status }: { status: ScenarioFull['status'] }) => {
    const { contactRouteConditions: generatedContactRouteConditions, customerConditions: generatedCustomerConditions } =
      generateConditions({
        logicalOperator: logicalOperator.value,
        contactRouteConditions: contactRouteConditions.value,
        customerConditions: customerConditions.value,
      })

    const data = {
      title: title.value,
      scenario_type_id: scenarioTypeId.value,
      mail_magazine_config_id: mailMagazineConfigId.value,
      status,
      allow_send_same_customer: allowSendSameCustomer.value,
      allow_send_all_customers: allowSendAllCustomers.value,
      contact_route_conditions: generatedContactRouteConditions,
      customer_conditions: generatedCustomerConditions,
      steps: (
        steps.value as {
          subject: StepType['subject']
          mailContentId: StepType['mail_content_id']
          // serialNumber // addでは存在しない
          sendIntervalDays: StepType['send_interval_days']
          month: StepType['month']
          day: StepType['day']
          hour: StepType['hour']
          minute: StepType['minute']
          dayOfWeek: StepType['day_of_week']
          isActive: StepType['is_active']
          timestamp: number
        }[]
      ).map((step) => ({
        id: null,
        mail_content_id: step.mailContentId,
        send_interval_days: step.sendIntervalDays,
        month: step.month,
        day: step.day,
        hour: step.hour,
        minute: step.minute,
        day_of_week: step.dayOfWeek,
      })),
    }

    try {
      await GqlCreateScenarios({ input: data })

      flashMessage.init({
        message: 'シナリオを作成しました',
        color: 'success',
      })

      await router.push({ name: 'crm_manager-v2-scenarios' })
      // ひとまずレスポンスデータは不要
    } catch (error: any) {
      let errMsg = ''
      if (error.gqlErrors[0].extensions.response) {
        errMsg = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: 'シナリオの作成に失敗しました',
        color: 'error',
      })

      errorMessage.value = errMsg || '入力内容をご確認ください'

      if (router.currentRoute.value.name === 'crm_manager-v2-scenarios-add-confirm') {
        await router.replace({ name: 'crm_manager-v2-scenarios-add', params: { from: 'confirm' } })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const updateErrorMessage = (value: string) => {
    errorMessage.value = value
  }

  return {
    title,
    logicalOperator,
    contactRoute,
    contactRouteConditions,
    customerConditions,
    sampleCustomers,
    allowSendSameCustomer,
    allowSendAllCustomers,
    scenarioTypeId,
    steps,
    mailMagazineConfigId,
    errorMessage,
    init,
    updateContactRouteCondition,
    updateTitle,
    updateLogicalOperator,
    updateContactRoute,
    updateContactRouteConditions,
    updateCustomerCondition,
    addCustomerCondition,
    deleteCustomerCondition,
    updateAllowSendSameCustomer,
    updateAllowSendAllCustomers,
    updateScenarioTypeId,
    updateStep,
    deleteStep,
    updateMailMagazineConfigId,
    addContactRouteCondition,
    deleteContactRouteCondition,
    addStep,
    sendTestMails,
    save,
    updateErrorMessage,
  }
})
