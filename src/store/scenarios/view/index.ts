import type * as State from '~/types/scenarios/state'
import { SCENARIO_TYPES } from '~/constants/scenarios'
import { PERAICHI_INFORMATION } from '~/constants'
import { parseConditions } from '~/stores/scenarios/helpers'
import type { CrmMailMagazineConfig, CrmScenarioShowFull, CrmStep } from '~/types/generated/graphql'

export const calcRatio = (numerator: number, denominator: number): number => {
  if (numerator === 0 || denominator === 0) {
    return 0
  }
  return Number(Intl.NumberFormat('lookup', { maximumFractionDigits: 1 }).format((numerator / denominator) * 100))
}

export const useScenariosViewStore = defineStore('scenariosView', () => {
  const flashMessage = useFlashMessage()
  const router = useRouter()

  // state
  const id = ref<number>(0)
  const scenarioTypeId = ref<CrmScenarioShowFull['scenario_type_id']>(0)
  const mailMagazineConfigId = ref<CrmScenarioShowFull['mail_magazine_config_id']>(0)
  const title = ref<CrmScenarioShowFull['title']>('')
  const status = ref<CrmScenarioShowFull['status']>('')
  const createdAt = ref<CrmScenarioShowFull['created_at']>('')
  const updatedAt = ref<CrmScenarioShowFull['updated_at']>('')
  const deliveryStartAt = ref<CrmScenarioShowFull['delivery_start_at']>('')
  const logicalOperator = ref<State.LogicalOperator | ''>('')
  const contactRoute = ref<State.ContactRoute | ''>('')
  const contactRouteConditions = ref<State.ContactRouteConditions>([])
  const customerConditions = ref<State.CustomerConditions>([])
  const allowSendSameCustomer = ref<CrmScenarioShowFull['allow_send_same_customer']>(false)
  const allowSendAllCustomers = ref<CrmScenarioShowFull['allow_send_all_customers']>(false)
  const steps = ref<CrmStep[]>([])
  const mailMagazineConfig = ref<CrmMailMagazineConfig>({
    user_name: '',
    from_mail_viewer_name: '',
    from_mail_address: '',
    replay_to_mail_address: '',
    zip_code: '',
    prefectures: '',
    address_1: '',
    address_2: '',
  })

  // Action
  const scenarioType = () => {
    return SCENARIO_TYPES.find((type) => type.id === scenarioTypeId.value)?.label || ''
  }

  const totalSendCount = () => {
    return steps.value.reduce((acc, cur) => acc + (cur.send_count ? cur.send_count : 0), 0)
  }

  const totalBounceCount = () => {
    return steps.value.reduce((acc, cur) => acc + (cur.bounce_count ? cur.bounce_count : 0), 0)
  }

  const totalOpenCount = () => {
    return steps.value.reduce((acc, cur) => acc + (cur.open_count ? cur.open_count : 0), 0)
  }

  const totalClickCount = () => {
    return steps.value.reduce((acc, cur) => acc + (cur.click_count ? cur.click_count : 0), 0)
  }

  const totalOpenRate = () => {
    return calcRatio(totalOpenCount(), totalSendCount())
  }

  const totalClickRate = () => {
    return calcRatio(totalClickCount(), totalSendCount())
  }

  const setId = (value: number) => {
    id.value = value
  }

  const setLogicalOperator = (val: State.LogicalOperator) => {
    logicalOperator.value = val
  }

  const setContactRoute = (val: State.ContactRoute) => {
    contactRoute.value = val
  }

  const setContactRouteConditions = (val: State.ContactRouteConditions) => {
    contactRouteConditions.value = val
  }

  const setCustomerConditions = (val: State.CustomerConditions) => {
    customerConditions.value = val
  }

  const init = () => {
    id.value = 0
    scenarioTypeId.value = 0
    mailMagazineConfigId.value = 0
    title.value = ''
    status.value = ''
    createdAt.value = ''
    updatedAt.value = ''
    deliveryStartAt.value = ''
    logicalOperator.value = ''
    contactRoute.value = ''
    contactRouteConditions.value = []
    customerConditions.value = []
    allowSendSameCustomer.value = false
    allowSendAllCustomers.value = false
    steps.value = []
    mailMagazineConfig.value = {
      user_name: '',
      from_mail_viewer_name: '',
      from_mail_address: '',
      replay_to_mail_address: '',
      zip_code: '',
      prefectures: '',
      address_1: '',
      address_2: '',
    }
  }

  const fetchScenario = async () => {
    try {
      const { CRMScenarioShowFull } = await GqlScenarioShowFull({ params: { path: { id: id.value } } })
      scenarioTypeId.value = CRMScenarioShowFull.scenario_type_id
      mailMagazineConfigId.value = CRMScenarioShowFull.mail_magazine_config_id
      title.value = CRMScenarioShowFull.title
      status.value = CRMScenarioShowFull.status
      allowSendSameCustomer.value = CRMScenarioShowFull.allow_send_same_customer
      allowSendAllCustomers.value = CRMScenarioShowFull.allow_send_all_customers
      createdAt.value = CRMScenarioShowFull.created_at
      updatedAt.value = CRMScenarioShowFull.updated_at
      deliveryStartAt.value = CRMScenarioShowFull.delivery_start_at
      const { logicalOperator, contactRoute, contactRouteConditions, customerConditions } = parseConditions({
        contactRouteConditions: CRMScenarioShowFull.contact_route_conditions,
        customerConditions: CRMScenarioShowFull.customer_conditions,
      })
      setLogicalOperator(logicalOperator)
      setContactRoute(contactRoute)
      setContactRouteConditions(contactRouteConditions)
      setCustomerConditions(customerConditions)
      steps.value = CRMScenarioShowFull.steps.map((step) => ({
        id: step.id,
        subject: step.subject,
        mail_content_id: step.mail_content_id,
        serial_number: step.serial_number,
        send_schedule_string: step.send_schedule_string,
        send_count: step.send_count,
        bounce_count: step.bounce_count,
        open_count: step.open_count,
        click_count: step.click_count,
        open_rate: calcRatio(step.open_count ? step.open_count : 0, step.send_count ? step.send_count : 0),
        click_rate: calcRatio(step.click_count ? step.click_count : 0, step.send_count ? step.send_count : 0),
        is_active: step.is_active,
      }))
      if (!CRMScenarioShowFull.mail_magazine_config) return
      const mail = CRMScenarioShowFull.mail_magazine_config
      mailMagazineConfig.value = {
        user_name: mail.user_name,
        from_mail_viewer_name: mail.use_peraichi_info ? PERAICHI_INFORMATION.companyName : mail.from_mail_viewer_name,
        from_mail_address: mail.from_mail_address,
        replay_to_mail_address: mail.replay_to_mail_address,
        zip_code: mail.use_peraichi_info ? PERAICHI_INFORMATION.zipCode : mail.zip_code,
        prefectures: mail.use_peraichi_info ? PERAICHI_INFORMATION.prefectures : mail.prefectures,
        address_1: mail.use_peraichi_info ? PERAICHI_INFORMATION.address1 : mail.address_1,
        address_2: mail.use_peraichi_info ? PERAICHI_INFORMATION.address2 : mail.address_2,
      }
    } catch (error: any) {
      flashMessage.init({
        message: 'シナリオの取得に失敗しました',
        color: 'error',
      })
      await router.push({ name: 'crm_manager-v2-scenarios' })
    }
  }

  const duplicateScenario = async () => {
    try {
      const input = { id: id.value }
      await GqlDuplicateScenario({ input })
      flashMessage.init({
        message: `シナリオを複製しました`,
        color: 'success',
      })
      await router.push({ name: 'crm_manager-v2-scenarios' })
    } catch (error: any) {
      let errMsg = 'シナリオの複製に失敗しました'
      if (error.gqlErrors[0].extensions.response) {
        errMsg = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: errMsg,
        color: 'error',
      })
    }
  }

  const deleteScenario = async () => {
    try {
      const input = { id: id.value }
      await GqlDeleteScenario({ input })
      flashMessage.init({
        message: `シナリオを削除しました`,
        color: 'success',
      })
      await router.push({ name: 'crm_manager-v2-scenarios' })
    } catch (error: any) {
      let errMsg = 'シナリオの削除に失敗しました'
      if (error.gqlErrors[0].extensions.response) {
        errMsg = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: errMsg,
        color: 'error',
      })
    }
  }

  return {
    id,
    scenarioTypeId,
    mailMagazineConfigId,
    title,
    status,
    createdAt,
    updatedAt,
    deliveryStartAt,
    logicalOperator,
    contactRoute,
    contactRouteConditions,
    customerConditions,
    allowSendSameCustomer,
    allowSendAllCustomers,
    steps,
    mailMagazineConfig,
    setId,
    scenarioType,
    totalSendCount,
    totalBounceCount,
    totalOpenCount,
    totalClickCount,
    totalOpenRate,
    totalClickRate,
    init,
    fetchScenario,
    duplicateScenario,
    deleteScenario,
  }
})
