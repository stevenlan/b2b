import {queryCart} from '@/api/cart'
import { getToken } from '@/utils/cookie'

const useCommodityStore = defineStore(
  'commodity',
  {
    state: () => ({
      cartTotal: 0
    }),
    actions: {
      getCart(open) {
        queryCart(open).then(r => {
          this.cartTotal = r.total
        })
      }
    }
  }
)

export default useCommodityStore