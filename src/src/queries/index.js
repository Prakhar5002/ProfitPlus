export const BASE_URL = 'http://profitpluszone.com/';

export async function registerUser(data) {
  return await fetch(BASE_URL + 'api/registration', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function mobileVerify(data) {
  return await fetch(BASE_URL + 'api/mobileVerify', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function login(data) {
  return await fetch(BASE_URL + 'api/login', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function forgotPassword(data) {
  return await fetch(BASE_URL + 'api/forgot-password', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function updatePassword(data) {
  return await fetch(BASE_URL + 'api/update-password', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function walletRecharge(data) {
  return await fetch(BASE_URL + 'api/wallet-recharge', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getPackageList() {
  return await fetch(BASE_URL + 'api/packagelist').then(res => res.json());
}

export async function purchasePackage(data) {
  return await fetch(BASE_URL + 'api/package-purchase', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getUserDetails(data) {
  return await fetch(BASE_URL + 'api/user-details', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function addBank(data) {
  return await fetch(BASE_URL + 'api/user-add-bank', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getUserPortfolio(data) {
  return await fetch(BASE_URL + 'api/user-portfolio', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function userBankDetails(data) {
  return await fetch(BASE_URL + 'api/user-bankdetails', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function transferableAmount(data) {
  return await fetch(BASE_URL + 'api/transferable-account', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function transferOutAmount(data) {
  return await fetch(BASE_URL + 'api/transfer-out-amount', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getBulletin() {
  return await fetch(BASE_URL + 'api/get-bulletin').then(res => res.json());
}

export async function createOrder(jsonData) {
  return await fetch('https://merchant.upigateway.com/api/create_order', {
    method: 'post',
    body: JSON.stringify(jsonData),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

export async function rechargeHistory(data) {
  return await fetch(BASE_URL + 'api/getuser-rechargehistory', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function transferOutHistory(data) {
  return await fetch(BASE_URL + 'api/getuser-transferout-history', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function withdrawalHistory(data) {
  return await fetch(BASE_URL + 'api/getuser-withdrawal-history', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getPaymentStatus(data) {
  return await fetch(BASE_URL + 'api/check-payment-status', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function cashWithdrawal(data) {
  return await fetch(BASE_URL + 'api/cash-withdrawal', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function getAppVersion(data) {
  return await fetch(BASE_URL + 'api/get-version').then(res => res.json());
}

export async function getNews(data) {
  return await fetch(BASE_URL + 'api/get-profit-news').then(res => res.json());
}

export async function checkOrderStatus(data) {
  return await fetch('https://merchant.upigateway.com/api/check_order_status', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

export async function paymentResponse(data) {
  return await fetch(BASE_URL + 'api/payment-response-app', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function commissionHistory(data) {
  return await fetch(BASE_URL + 'api/getUser-commissionhistory', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}

export async function transferableReward(data) {
  return await fetch(BASE_URL + 'api/user-reward-transferable', {
    method: 'post',
    body: data,
  }).then(res => res.json());
}
