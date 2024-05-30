import { generateConditions, parseConditions } from '~/stores/scenarios/helpers'

import type { ScenarioFull } from '~/types/scenarios'
import type * as State from '~/types/scenarios/state'
import type { CrmUpdateScenarioInput } from '~/types/generated/graphql'

type StepType = ScenarioFull['steps'][0]

export const useScenariosEditStore = defineStore('scenariosEdit', () => {
  const flashMessage = useFlashMessage()
  const router = useRouter()

  const id = ref(0 as ScenarioFull['id'])
  const status = ref('' as ScenarioFull['status'])

  const title = ref('' as ScenarioFull['title'])

  // 送信条件
  const logicalOperator = ref('' as State.LogicalOperator)
  const contactRoute = ref('' as State.ContactRoute)
  const contactRouteConditions = ref([] as State.ContactRouteConditions)
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
      id: StepType['id'] | null
      subject: StepType['subject']
      mailContentId: StepType['mail_content_id']
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

  // その他
  const existsSentMail = ref(false as ScenarioFull['exists_sent_mail'])
  const createdAt = ref('' as ScenarioFull['created_at'])
  const updatedAt = ref('' as ScenarioFull['updated_at'])
  const isFetching = ref(false as boolean)
  const errorMessage = ref('' as string)

  // FYI: まだ複製時のパターンは考えない

  const isDraft = computed(() => status.value === 'draft')
  const isRunning = computed(() => status.value === 'running')
  const isStopped = computed(() => status.value === 'stopped')

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

  const init = () => {
    id.value = 0
    status.value = '' as ScenarioFull['status']
    title.value = ''
    logicalOperator.value = '' as State.LogicalOperator
    contactRoute.value = '' as State.ContactRoute
    contactRouteConditions.value = []
    customerConditions.value = []
    sampleCustomers.value = []
    allowSendSameCustomer.value = false
    allowSendAllCustomers.value = false
    scenarioTypeId.value = 1
    steps.value = []
    mailMagazineConfigId.value = 0
    existsSentMail.value = false
    createdAt.value = ''
    updatedAt.value = ''
    isFetching.value = false
    errorMessage.value = ''
  }

  const setId = (value: ScenarioFull['id']) => {
    id.value = value
  }

  const updateTitle = (value: ScenarioFull['title']) => {
    title.value = value
  }

  // 送信条件
  const updateLogicalOperator = (value: State.LogicalOperator) => {
    logicalOperator.value = value
  }

  const updateContactRoute = (value: State.ContactRoute) => {
    contactRoute.value = value
  }

  // 送信条件: 流入経路
  const updateContactRouteConditions = (value: State.ContactRouteConditions) => {
    contactRouteConditions.value = value
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
    customerConditions.value.push({
      key: '',
      operator: '=',
      value: '',
    } as unknown as State.CustomerConditions[number])
  }

  const deleteCustomerCondition = (index: number) => {
    customerConditions.value.splice(index, 1)
  }

  // 送信条件: その他
  const updateAllowSendSameCustomer = (value: ScenarioFull['allow_send_same_customer']) => {
    allowSendSameCustomer.value = value
  }

  const updateAllowSendAllCustomers = (value: ScenarioFull['allow_send_all_customers']) => {
    allowSendAllCustomers.value = value
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

  // メール設定（ステップ）
  const updateScenarioTypeId = (value: ScenarioFull['scenario_type_id']) => {
    scenarioTypeId.value = value
  }

  const updateStep = ({
    index,
    step,
  }: {
    index: number
    step: {
      id: StepType['id'] | null
      subject: StepType['subject']
      mailContentId: StepType['mail_content_id']
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
    steps.value.push({
      id: null,
      subject: '',
      mailContentId: 0,
      sendIntervalDays: 0,
      month: null,
      day: null,
      hour: 0,
      minute: 0,
      dayOfWeek: null,
      isActive: true,
      timestamp: new Date().getTime(),
    })
  }

  // 送信主情報
  const updateMailMagazineConfigId = (value: ScenarioFull['mail_magazine_config_id']) => {
    mailMagazineConfigId.value = value
  }

  // fetch
  const fetchScenario = async () => {
    isFetching.value = true
    try {
      const { CRMScenarioShowFull } = await GqlScenarioShowFull({
        params: {
          path: {
            id: id.value,
          },
        },
      })
      title.value = CRMScenarioShowFull.title as ScenarioFull['title']
      status.value = CRMScenarioShowFull.status as ScenarioFull['status']

      // 送信条件
      const {
        logicalOperator: _logicalOperator,
        contactRoute: _contactRoute,
        contactRouteConditions: _contactRouteConditions,
        customerConditions: _customerConditions,
      } = parseConditions({
        contactRouteConditions: CRMScenarioShowFull.contact_route_conditions,
        customerConditions: CRMScenarioShowFull.customer_conditions,
      })

      logicalOperator.value = _logicalOperator
      contactRoute.value = _contactRoute
      contactRouteConditions.value = _contactRouteConditions
      customerConditions.value = _customerConditions

      // メール設定（ステップ）
      scenarioTypeId.value = CRMScenarioShowFull.scenario_type_id as ScenarioFull['scenario_type_id']
      allowSendSameCustomer.value =
        CRMScenarioShowFull.allow_send_same_customer as ScenarioFull['allow_send_same_customer']
      allowSendAllCustomers.value =
        CRMScenarioShowFull.allow_send_all_customers as ScenarioFull['allow_send_all_customers']
      // 下書き状態で再保存する時はstepを新規作成するため、idは強制的にnullにする
      steps.value = CRMScenarioShowFull.steps.map((step, index) => ({
        id: isDraft.value ? null : step.id,
        subject: step.subject,
        mailContentId: step.mail_content_id,
        sendIntervalDays: step.send_interval_days,
        month: step.month,
        day: step.day,
        hour: step.hour,
        minute: step.minute,
        dayOfWeek: step.day_of_week,
        isActive: step.is_active,
        timestamp: new Date().getTime() + index,
      })) as typeof steps.value

      // 送信主情報
      mailMagazineConfigId.value =
        CRMScenarioShowFull.mail_magazine_config_id as ScenarioFull['mail_magazine_config_id']

      // その他
      existsSentMail.value = CRMScenarioShowFull.exists_sent_mail as ScenarioFull['exists_sent_mail']
      createdAt.value = CRMScenarioShowFull.created_at as ScenarioFull['created_at']
      updatedAt.value = CRMScenarioShowFull.updated_at as ScenarioFull['updated_at']
    } catch (error) {
      flashMessage.init({
        message: 'シナリオの取得に失敗しました',
        color: 'error',
      })
      await router.push({ name: 'crm_manager-v2-scenarios' })
    }
    isFetching.value = false
  }

  // save
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
          id: StepType['id']
          mailContentId: StepType['mail_content_id']
          // serialNumber // addでは存在しない
          sendIntervalDays: StepType['send_interval_days']
          month: StepType['month']
          day: StepType['day']
          hour: StepType['hour']
          minute: StepType['minute']
          dayOfWeek: StepType['day_of_week']
        }[]
      ).map((step) => ({
        id: step.id,
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
      const input: CrmUpdateScenarioInput = {
        path: {
          id: id.value,
        },
        request_body: data,
      }
      await GqlUpdateScenario({ input })

      flashMessage.init({
        message: 'シナリオを更新しました',
        color: 'success',
      })
      await router.push({ name: 'crm_manager-v2-scenarios-view-id', params: { id: id.value } })
      // ひとまずレスポンスデータは不要
    } catch (error: any) {
      let errMessage: string = ''
      if (error.gqlErrors[0].extensions.response) {
        errMessage = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: 'シナリオの更新に失敗しました',
        color: 'error',
      })
      errorMessage.value = errMessage || '入力内容をご確認ください'
      if (router.currentRoute.value.name === 'crm_manager-v2-scenarios-confirm-id') {
        await router.replace({
          name: 'crm_manager-v2-scenarios-edit-id',
          params: {
            id: `${id.value}
          `,
            from: 'confirm',
          },
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const updateErrorMessage = (value: string) => {
    errorMessage.value = value
  }
  return {
    id,
    status,
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
    existsSentMail,
    createdAt,
    updatedAt,
    isFetching,
    errorMessage,
    isDraft,
    isRunning,
    isStopped,
    init,
    setId,
    updateTitle,
    updateLogicalOperator,
    updateContactRoute,
    updateContactRouteConditions,
    updateContactRouteCondition,
    addContactRouteCondition,
    deleteContactRouteCondition,
    updateCustomerCondition,
    addCustomerCondition,
    deleteCustomerCondition,
    updateAllowSendSameCustomer,
    updateAllowSendAllCustomers,
    sendTestMails,
    updateScenarioTypeId,
    updateStep,
    deleteStep,
    addStep,
    updateMailMagazineConfigId,
    fetchScenario,
    save,
    updateErrorMessage,
  }
})
