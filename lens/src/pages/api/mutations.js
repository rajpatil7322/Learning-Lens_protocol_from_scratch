const authenticate = `
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`

const refresh = `
  mutation Refresh(
    $refreshToken: Jwt!
  ) {
    refresh(request: {
      refreshToken: $refreshToken
    }) {
      accessToken
      refreshToken
    }
  }
`
const createPostTypedData = `
mutation createPostTypedData($request: CreatePublicPostRequest!) {
  createPostTypedData(request: $request) {
    id
    expiresAt
    typedData {
      types {
        PostWithSig {
          name
          type
        }
      }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`

export {
    authenticate,
    refresh,
    createPostTypedData
}