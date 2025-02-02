import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'

import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'

type Props = {
  name: string
  address: string | undefined
  profile: ReturnedENS['getProfile']
  selfAbilities: ReturnType<typeof useSelfAbilities>
  subnameAbilities: ReturnType<typeof useSubnameAbilities>['abilities']
}

export const useProfileActions = ({
  name,
  address,
  profile,
  selfAbilities,
  subnameAbilities,
}: Props) => {
  const { name: primaryName, loading: primaryLoading } = usePrimary(address || '')
  const { createTransactionFlow, showDataInput } = useTransactionFlow()
  const { t } = useTranslation('profile')

  const profileActions = useMemo(() => {
    const actions: { onClick: () => void; red?: boolean; label: string; disabled?: boolean }[] = []
    if (!address) return actions
    if ((selfAbilities.canEdit || profile?.address === address) && primaryName !== name) {
      const setAsPrimaryTransactions: GenericTransaction[] = [
        makeTransactionItem('setPrimaryName', {
          name,
          address: address!,
        }),
      ]
      if (profile?.address !== address) {
        setAsPrimaryTransactions.unshift(
          makeTransactionItem('updateEthAddress', {
            address: address!,
            name,
          }),
        )
      }
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        onClick: () =>
          createTransactionFlow(`setPrimaryName-${name}-${address}`, {
            transactions: setAsPrimaryTransactions,
            resumable: true,
            intro:
              setAsPrimaryTransactions.length > 1
                ? {
                    title: t('tabs.profile.actions.setAsPrimaryName.title'),
                    content: makeIntroItem('ChangePrimaryName', undefined),
                  }
                : undefined,
          }),
      })
    }

    if (selfAbilities.canEdit) {
      actions.push({
        label: t('tabs.profile.actions.editProfile.label'),
        onClick: () =>
          showDataInput(
            `edit-profile-${name}`,
            'ProfileEditor',
            { name },
            { disableBackgroundClick: true },
          ),
      })
    }

    if (subnameAbilities.canDelete && subnameAbilities.canDeleteContract) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () =>
          createTransactionFlow(`deleteSubname-${name}`, {
            transactions: [
              makeTransactionItem('deleteSubname', {
                name,
                contract: subnameAbilities.canDeleteContract!,
              }),
            ],
          }),
        red: true,
      })
    }

    if (subnameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        red: true,
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    address,
    createTransactionFlow,
    name,
    primaryName,
    profile?.address,
    selfAbilities.canEdit,
    showDataInput,
    subnameAbilities.canDelete,
    subnameAbilities.canDeleteContract,
    subnameAbilities.canDeleteError,
    t,
  ])

  return {
    profileActions,
    loading: primaryLoading,
  }
}
