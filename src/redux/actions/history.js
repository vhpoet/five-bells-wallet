import * as types from '../actionTypes'

// TODO shouldn't ask for transfer link
export const toggleJson = (id, transfer) => (dispatch, getState) => {
  const payment = getState().history.list.filter((item) => {
    return item.id === id
  })[0]

  // Hide the json
  if (payment.showJson) {
    return dispatch({
      type: types.PAYMENT_JSON_HIDE,
      id
    })
  } else if (payment.json) { // Show the json
    return dispatch({
      type: types.PAYMENT_JSON_SHOW,
      id
    })
  }

  // Load the json
  return dispatch({
    types: [types.PAYMENT_JSON_LOADING, types.PAYMENT_JSON_SUCCESS, types.PAYMENT_JSON_FAIL],
    promise: (client) => client.get(transfer),
    id
  })
}

// TODO separate module for WS stuff?
export const addPayment = (data) => (dispatch) => {
  // TODO There's no id anymore, but this might become an issue
  /* const duplicate = getState().history.list.filter((item) => {
    return item.id === data.id
  })[0]

  if (duplicate) return false */

  /* const change = getState().auth.user.account === data.destination_account
   ? Number(data.destination_amount)
   : -Number(data.destination_amount)

   dispatch({
   type: types.UPDATE_BALANCE,
   change: change
   }) */

  return dispatch({
    type: types.WS_PAYMENT,
    result: data
  })
}

export const loadTransfers = (payment) => {
  return {
    timeSlot: payment.time_slot,
    types: [types.LOAD_TRANSFERS, types.LOAD_TRANSFERS_SUCCESS, types.LOAD_TRANSFERS_FAIL],
    promise: (client) => client.get('/payments/transfers/' + payment.time_slot, {
      params: {
        sourceAccount: payment.source_account,
        destinationAccount: payment.destination_account
      }
    })
  }
}
