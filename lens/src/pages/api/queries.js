const getChallenge = `
query Challenge($address: EthereumAddress!) {
  challenge(request: { address: $address }) {
    text
  }
}
`

export {
    getChallenge,
}