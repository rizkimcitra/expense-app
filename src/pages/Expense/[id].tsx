import { AuthLayer, Image, Loading, LoadingPage, PrimaryButton, Tooltip } from '@/components'

import empty_history from '@/assets/empty_history.svg'
import { useCreateHistoryModal } from '@/hooks'
import { useExpenseDetail } from '@/hooks'
import { formatCurrency, formatDate, twclsx } from '@/utils'

import { Suspense, lazy, useEffect } from 'react'
import { HiCalendar, HiCash, HiCreditCard, HiPlus } from 'react-icons/hi'

const HistoryLists = lazy(() => import('@/components').then((m) => ({ default: m.HistoryLists })))

const ExpenseHistory: React.FunctionComponent = () => {
  const { openModal } = useCreateHistoryModal()

  const { expenseDetail, isLoading, isError, historyLists, syncFirstMounted } = useExpenseDetail()

  useEffect(() => {
    syncFirstMounted()
  }, [])

  if (isLoading && !isError) return <LoadingPage />

  return (
    <AuthLayer>
      <section className={twclsx('pt-10')}>
        <h1>History</h1>
        <div className='flex items-center gap-4 mt-4'>
          <div
            className={twclsx(
              'inline-flex items-center gap-2',
              'p-1 px-2 border rounded-lg font-medium',
              'text-theme-5 dark:text-theme-3 border-theme-3 dark:border-theme-6'
            )}
          >
            <HiCalendar />
            {expenseDetail?.created_at && <span>{formatDate(expenseDetail?.created_at)}</span>}
          </div>

          <Tooltip title='This is your base money' position='top-start' arrowSize='regular' arrow>
            <div
              className={twclsx(
                'inline-flex items-center gap-2',
                'p-1 px-2 border rounded-lg font-medium',
                'text-theme-5 dark:text-theme-3 border-theme-3 dark:border-theme-6'
              )}
            >
              <HiCash />
              {expenseDetail?.total_money && (
                <span>{formatCurrency(expenseDetail.total_money)}</span>
              )}
            </div>
          </Tooltip>
        </div>
      </section>

      <section className='pt-10'>
        <div className={twclsx('flex items-center justify-between', 'w-full')}>
          <div className='inline-flex flex-col gap-4'>
            <h2 className='inline-flex items-center gap-2'>
              <HiCreditCard />
              <span>{expenseDetail?.title ?? ''}</span>
            </h2>

            <div className={twclsx('inline-flex flex-col gap-2')}>
              <p>
                Curently have:{' '}
                <span className='font-semibold text-success-1'>
                  {expenseDetail?.currentMoney
                    ? formatCurrency(expenseDetail.currentMoney ?? 0)
                    : 0}
                </span>
              </p>

              <p>
                Earned:{' '}
                <span className='font-semibold text-success-1'>
                  {expenseDetail?.totalIncome ? formatCurrency(expenseDetail.totalIncome ?? 0) : 0}
                </span>
              </p>

              <p>
                Spended:{' '}
                <span className='font-semibold text-warning-1'>
                  {expenseDetail?.totalOutcome
                    ? formatCurrency(expenseDetail.totalOutcome ?? 0)
                    : 0}
                </span>
              </p>
            </div>
          </div>

          <Tooltip
            title='Create new history'
            position='top-end'
            arrowSize='regular'
            className='self-start'
            arrow
          >
            <PrimaryButton
              onClick={openModal}
              className={twclsx('w-10 h-10 md:h-11 md:w-[unset] md:px-4', 'gap-2')}
            >
              <HiPlus />
              <span className='hidden md:block'>Create</span>
            </PrimaryButton>
          </Tooltip>
        </div>

        <div className='mt-4'>
          {historyLists && historyLists.length > 0 ? (
            <Suspense fallback={<Loading />}>
              <HistoryLists history={historyLists} />
            </Suspense>
          ) : (
            <div
              className={twclsx(
                'flex flex-col items-center justify-center',
                'gap-2 text-center w-full py-10'
              )}
            >
              <Image src={empty_history} alt='No history' className='w-40 h-40' />
              <p className='text-lg md:text-xl font-bold'>
                There&apos;s nothing to show here, add some history!
              </p>
            </div>
          )}
        </div>
      </section>
    </AuthLayer>
  )
}

export default ExpenseHistory
