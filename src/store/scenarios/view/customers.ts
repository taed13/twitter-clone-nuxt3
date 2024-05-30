import { DEFAULT_COUNT_PER_PAGE, DEFAULT_PAGE_COUNT } from '~/constants'
import type { CrmCustomerByScenarioId, CrmCustomersByScenarioIdQueryInput } from '~/types/generated/graphql'

export const useScenariosViewCustomersStore = defineStore('scenariosViewCustomers', () => {
  const flashMessage = useFlashMessage()
  const router = useRouter()

  // state
  const id = ref<number>(0)
  const serialNumber = ref<number>(0)
  const customers = ref<CrmCustomerByScenarioId[]>([])
  const totalCount = ref<number>(0)
  const totalPages = ref<number>(0)
  const queryParams = ref<CrmCustomersByScenarioIdQueryInput>({
    l: DEFAULT_COUNT_PER_PAGE,
    page: DEFAULT_PAGE_COUNT,
  })

  // Action
  const startPageCounts = () => {
    if (!queryParams.value.page || !queryParams.value.l) return 1
    return (queryParams.value.page - 1) * queryParams.value.l + 1
  }

  const endPageCounts = () => {
    return Math.min(queryParams.value.page * queryParams.value.l, totalCount.value)
  }

  const hasPagination = () => {
    return totalCount.value > queryParams.value.l
  }

  const init = () => {
    id.value = 0
    serialNumber.value = 0
    customers.value = []
    queryParams.value = {
      l: DEFAULT_COUNT_PER_PAGE,
      page: DEFAULT_PAGE_COUNT,
    }
    totalCount.value = 0
    totalPages.value = 0
  }

  const setId = (val: number) => {
    id.value = val
  }

  const setSerialNumber = (val: number) => {
    serialNumber.value = val
  }

  const setQueryParams = (params: any) => {
    queryParams.value = { ...queryParams.value, ...params }
  }

  const removeQueryParams = (paramKey: keyof CrmCustomersByScenarioIdQueryInput) => {
    if (paramKey in queryParams.value) {
      delete queryParams.value[paramKey]
    }
  }

  const fetchCustomers = async () => {
    try {
      const { CRMCustomersByScenarioId } = await GqlCustomersByScenarioId({
        params: {
          path: {
            id: id.value,
          },
          query: {
            serial_number: serialNumber.value,
            page: queryParams.value.page,
            l: queryParams.value.l,
          },
        },
      })
      customers.value = CRMCustomersByScenarioId.customers.map((customer) => ({
        id: customer.id,
        mail_address: customer.mail_address,
        send_status: customer.send_status,
        sent_at: customer.sent_at,
        event: customer.event,
      }))
      totalCount.value = CRMCustomersByScenarioId.total_count
      totalPages.value = CRMCustomersByScenarioId.total_pages
    } catch (error: any) {
      flashMessage.init({
        message: 'データ取得に失敗しました',
        color: 'error',
      })
      await router.push({ name: `crm_manager-v2-scenarios-view-${id.value}` })
    }
  }

  const reFetchCustomers = async () => {
    queryParams.value = { ...queryParams.value, ...{ page: 1 } }
    await fetchCustomers()
  }

  return {
    id,
    serialNumber,
    customers,
    queryParams,
    totalCount,
    totalPages,
    startPageCounts,
    endPageCounts,
    hasPagination,
    init,
    setId,
    setSerialNumber,
    setQueryParams,
    fetchCustomers,
    reFetchCustomers,
  }
})
