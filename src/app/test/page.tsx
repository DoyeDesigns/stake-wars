import { Allowance, BalanceOf } from '@/components/ReadTransaction'
import { Transfer, TransferFrom, WriteTransaction } from '@/components/WriteTransaction'

export default function ContractInteraction() {
  return (
    <div className='h-screen overflow-auto pb-[200px] bg-background flex flex-col text-center items-center'>
        <BalanceOf />
        <Allowance />
        <WriteTransaction />
        <Transfer />
        <TransferFrom />
    </div>
  )
}
