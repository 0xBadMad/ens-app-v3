import { TransactionDisplayItem } from '@app/types'
import { Button, Dialog } from '@ensdomains/thorin'
import { ComponentProps, Dispatch, ReactNode } from 'react'
import type { DataInputComponent } from './input'
import type { IntroComponentName } from './intro'
import { makeTransactionItem, TransactionName } from './transaction'

export type TransactionFlowStage = 'input' | 'intro' | 'transaction'

export type TransactionStage = 'confirm' | 'wallet' | 'sent'

type GenericDataInput = {
  name: keyof DataInputComponent
  data: any
}

export type GenericTransaction = {
  name: TransactionName
  data: any
}

type GenericIntro = {
  name: IntroComponentName
  data: any
}

export type TransactionIntro = {
  title: string
  leadingLabel?: string
  trailingLabel?: string
  content: GenericIntro
}

export type TransactionFlowItem = {
  input?: GenericDataInput
  intro?: TransactionIntro
  transactions: GenericTransaction[]
  resumable?: boolean
}

export type BaseInternalTransactionFlowItem = TransactionFlowItem & {
  currentTransaction: number
  currentTransactionComplete: boolean
  currentFlowStage: TransactionFlowStage
}

export type InternalTransactionFlowItem =
  | BaseInternalTransactionFlowItem
  | (BaseInternalTransactionFlowItem & {
      currentFlowStage: 'input'
      input: GenericDataInput
    })

export type InternalTransactionFlow = {
  selectedKey: string | null
  items: { [key: string]: InternalTransactionFlowItem }
}

export type TransactionFlowAction =
  | {
      name: 'showDataInput'
      payload: {
        input: GenericDataInput
      }
      key: string
    }
  | {
      name: 'startFlow'
      payload: TransactionFlowItem
      key: string
    }
  | {
      name: 'resumeFlow'
      key: string
    }
  | {
      name: 'setTransactions'
      payload: ReturnType<typeof makeTransactionItem>[]
    }
  | {
      name: 'setFlowStage'
      payload: TransactionFlowStage
    }
  | {
      name: 'stopFlow'
    }
  | {
      name: 'setTransactionComplete'
    }
  | {
      name: 'incrementTransaction'
    }

export type TransactionDialogProps = ComponentProps<typeof Dialog> & {
  variant: 'actionable'
  children: () => ReactNode
  leading: ComponentProps<typeof Button>
  trailing: ComponentProps<typeof Button>
}

export type TransactionDialogPassthrough = {
  dispatch: Dispatch<TransactionFlowAction>
  onDismiss: () => void
}

export type ManagedDialogProps = {
  transaction: GenericTransaction
  onDismiss?: (success?: boolean) => void
  onSuccess?: () => void
  dismissBtnLabel?: string
  completeBtnLabel?: string
  completeTitle?: string
  actionName: string
  displayItems: TransactionDisplayItem[]
}
