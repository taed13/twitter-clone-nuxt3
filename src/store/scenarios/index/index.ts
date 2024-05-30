import { DEFAULT_COUNT_PER_PAGE, DEFAULT_PAGE_COUNT } from '~/constants'
import type { ScenariosIndexQueryParams } from '~/types/scenarios'
import type { CrmScenariosInput, CrmScenario, CrmMailContentWithoutPagerList } from '~/types/generated/graphql'

export const useScenariosStore = defineStore('scenarios', () => {
  const commonStore = useCommonStore()
  const flashMessage = useFlashMessage()

  // state
  const scenarios = ref<CrmScenario[]>([])
  const totalCount = ref(0)
  const totalPages = ref(0)
  const queryParams = ref<CrmScenariosInput>({
    l: DEFAULT_COUNT_PER_PAGE,
    page: DEFAULT_PAGE_COUNT,
  })
  const mailContents = ref<CrmMailContentWithoutPagerList[]>([])

  // Action
  const init = () => {
    scenarios.value = []
    totalCount.value = 0
    totalPages.value = 0
    queryParams.value = {
      l: DEFAULT_COUNT_PER_PAGE,
      page: DEFAULT_PAGE_COUNT,
    }
    mailContents.value = []
  }

  const startPageCounts = () => {
    if (!queryParams.value.page || !queryParams.value.l) return 0
    return (queryParams.value.page - 1) * queryParams.value.l + 1
  }

  const endPageCounts = () => {
    if (!queryParams.value.page || !queryParams.value.l) return 0
    return Math.min(queryParams.value.page * queryParams.value.l, totalCount.value)
  }

  const hasPersistedScenarios = () => {
    const FILTERS = ['title', 'mail_content_id', 'status'] as const
    const hasNo = scenarios.value.length === 0 && FILTERS.every((filter) => !queryParams.value[filter])
    return !hasNo
  }

  const hasPagination = () => {
    if (!queryParams.value.l) return false
    return totalCount.value > queryParams.value.l
  }

  const setQueryParams = (params: ScenariosIndexQueryParams) => {
    queryParams.value = { ...queryParams.value, ...params }
  }

  const removeQueryParams = (paramKey: keyof ScenariosIndexQueryParams) => {
    if (paramKey in queryParams.value) {
      delete queryParams.value[paramKey]
    }
  }

  const fetchScenarios = async () => {
    try {
      const { CRMScenarios } = await GqlScenarios({ params: queryParams.value })
      scenarios.value = CRMScenarios.data.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        status: scenario.status,
        createdAt: scenario.created_at,
        deliveryStartAt: scenario.delivery_start_at,
        totalSteps: scenario.total_steps,
      }))
      totalCount.value = CRMScenarios.total_count as number
      totalPages.value = CRMScenarios.total_pages as number
    } catch (error: any) {
      let errMsg = 'シナリオメール一覧の取得に失敗しました'
      if (error.gqlErrors[0].extensions.response) {
        errMsg = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: errMsg,
        color: 'error',
      })
    }
  }

  const reFetchScenarios = async () => {
    setQueryParams({ page: 1 })
    await fetchScenarios()
  }

  const fetchMailContents = async () => {
    const uid = commonStore.uid
    const params = {
      uid,
    }
    try {
      const { CRMMailContentWithoutPager } = await GqlMailContentWithoutPager({ params })
      mailContents.value = CRMMailContentWithoutPager as CrmMailContentWithoutPagerList[]
    } catch (error: any) {
      let errMsg = 'データの取得に失敗しました'
      if (error.gqlErrors[0].extensions.response) {
        errMsg = error.gqlErrors[0].extensions.response.body.message
      }
      flashMessage.init({
        message: errMsg,
        color: 'error',
      })
    }
  }

  const duplicateScenarioById = async (id: number) => {
    try {
      const input = { id }
      await GqlDuplicateScenario({ input })
      flashMessage.init({
        message: `シナリオを複製しました`,
        color: 'success',
      })
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

  const deleteScenarioById = async (id: number) => {
    try {
      const input = { id }
      await GqlDeleteScenario({ input })
      flashMessage.init({
        message: `シナリオを削除しました`,
        color: 'success',
      })
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
    scenarios,
    totalCount,
    totalPages,
    queryParams,
    mailContents,
    init,
    startPageCounts,
    endPageCounts,
    hasPersistedScenarios,
    removeQueryParams,
    setQueryParams,
    reFetchScenarios,
    duplicateScenarioById,
    fetchScenarios,
    deleteScenarioById,
    fetchMailContents,
    hasPagination,
  }
})
