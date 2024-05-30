// import dayjs from 'dayjs'
// import { MONTHLY_SENDED_MAIL_LIMIT } from '~/constants'
// import type { CrmLandingPagesList } from '~/types/generated/graphql'
//
// export const useCommonStore = defineStore('common', () => {
//   // state
//   const uid = ref('')
//   const basePlanTypeId = ref(0)
//   const username = ref('')
//   const isTrial = ref(false)
//   const isAdminUser = ref(false)
//   const headerHtml = ref('')
//   const footerHtml = ref('')
//   const commonElementsJsPath = ref('')
//   const landingPages = ref<CrmLandingPagesList[]>([])
//   const loadingState = ref(false)
//   const currentMailMagazineConfigsId = ref(0)
//   const activeChargingMethodId = ref(0)
//   const payPerUseAgreement = ref(false)
//   const hasFuncShukyakuPlan = ref(false)
//   const hasFuncAIAssistant = ref(false)
//   const monthlySentMailMagazinesCount = ref(0)
//   const planPeriodCount = ref('')
//   const hasAgreedToPeraichiTerms = ref(false)
//
//   // Action
//   const isEnabledPayPerUse = Boolean(activeChargingMethodId.value && payPerUseAgreement.value)
//   const hasExceededMonthlyEmailLimit = monthlySentMailMagazinesCount.value > MONTHLY_SENDED_MAIL_LIMIT
//   const isLimitedPayPerUse = () => {
//     if (basePlanTypeId.value === 34) {
//       if (monthlySentMailMagazinesCount.value > MONTHLY_SENDED_MAIL_LIMIT) return true
//     }
//
//     // 従量課金に同意しているか 同意していたら制限なし
//     if (activeChargingMethodId.value && payPerUseAgreement.value) {
//       return false
//     } else {
//       // 送信通数が上限を超えていないか
//       if (monthlySentMailMagazinesCount.value > MONTHLY_SENDED_MAIL_LIMIT) return true
//       // 一定のプランか
//       return !hasFuncShukyakuPlan.value
//     }
//   }
//
//   const setUserInfo = (data: any) => {
//     uid.value = data.uid || ''
//     basePlanTypeId.value = data.base_plan_type_id
//     username.value = data.username || ''
//     isTrial.value = data.is_trial || false
//     isAdminUser.value = data.is_admin_user || false
//     activeChargingMethodId.value = data.active_charging_method_id
//     payPerUseAgreement.value = data.pay_per_use_agreement
//     hasFuncShukyakuPlan.value = data.funcs?.has_func_shukyaku_plan || false
//     hasFuncAIAssistant.value = data.funcs?.has_func_ai_assistant || false
//     planPeriodCount.value = data.base_plan
//       ? `${dayjs(data.base_plan.starting_date).format('YYYY年M月D日')} ~ ${dayjs(data.base_plan.closing_date).format(
//           'YYYY年M月D日'
//         )}`
//       : ''
//     hasAgreedToPeraichiTerms.value = data.agreed_tos_services?.includes('peraichi') || false
//   }
//
//   const fetchUserInfo = async () => {
//     const { CRMUserInfo } = await GqlUserInfo()
//     setUserInfo(CRMUserInfo)
//   }
//
//   const fetchLandingPages = async () => {
//     const { CRMLandingPagesList } = await GqlLandingPagesList()
//     landingPages.value = CRMLandingPagesList as CrmLandingPagesList[]
//   }
//
//   const fetchMailMagazinesCount = async () => {
//     const params = {
//       user_id: uid.value,
//     }
//
//     const { CRMMailMagazineMonthlySentCount } = await GqlMailMagazineMonthlySentCount({ params })
//     monthlySentMailMagazinesCount.value = CRMMailMagazineMonthlySentCount.monthly_sended_count as number
//   }
//
//   return {
//     uid,
//     basePlanTypeId,
//     username,
//     isTrial,
//     isAdminUser,
//     headerHtml,
//     footerHtml,
//     commonElementsJsPath,
//     landingPages,
//     loadingState,
//     currentMailMagazineConfigsId,
//     activeChargingMethodId,
//     payPerUseAgreement,
//     hasFuncShukyakuPlan,
//     hasFuncAIAssistant,
//     monthlySentMailMagazinesCount,
//     planPeriodCount,
//     hasAgreedToPeraichiTerms,
//     isEnabledPayPerUse,
//     hasExceededMonthlyEmailLimit,
//     isLimitedPayPerUse,
//     setUserInfo,
//     fetchUserInfo,
//     fetchLandingPages,
//     fetchMailMagazinesCount,
//   }
// })
