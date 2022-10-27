import { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { generateCrustAuthToken } from '@subsocial/api/utils/ipfs'
import { IpfsContent } from "@subsocial/api/substrate/wrappers"
import { RawSpaceData } from '@subsocial/api/types'
import { waitReady } from '@polkadot/wasm-crypto'

let flatApi: SubsocialApi
let ipfs: SubsocialIpfsApi
let selectedAddress: string
let selectedProfile: RawSpaceData | undefined
const spaceId = '9953'


export const connectSubsocial = async () => {

  flatApi = await SubsocialApi.create({
    substrateNodeUrl: 'wss://rco-para.subsocial.network',
    ipfsNodeUrl: 'https://crustwebsites.net',
    useServer: {
      httpRequestMethod: 'get'
    }
  })

  await waitReady()
  const authHeader = generateCrustAuthToken('bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice')

  ipfs = new SubsocialIpfsApi({
    ipfsNodeUrl: 'https://crustwebsites.net'
  })

  ipfs.setWriteHeaders({
    authorization: 'Basic ' + authHeader
  })

  console.log('connected', flatApi)

  return flatApi
}

export const signAndSendTx = async (tx: any) => {
  const { isWeb3Injected, web3Enable, web3AccountsSubscribe, web3FromAddress } = await import('@polkadot/extension-dapp')

  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const extensions = await web3Enable('twitter')

  if (extensions.length === 0) {
    // the user did not accept the authorization
    // in this case we should inform the use and give a link to the extension
    alert('Polkadot Extension not authorized');
    return;
  }

  if (!isWeb3Injected) {
    // no extension installed
    alert('Browser has not extension')
    return;
  }

  await web3AccountsSubscribe(async (injectedAccounts) => {
    if (injectedAccounts.length > 0) {
      const addresses = injectedAccounts.map((account) => account.address)

      const { signer } = await web3FromAddress(addresses[0])
      await tx.signAsync(addresses[0], { signer })

      await tx.send((result: any) => {
        const { status } = result

        if (!result || !status) {
          return;
        }
      })

    }
  })
}

export const fetchProfile = async (address: string) => {
  const accountId = address
  const profileSpaceId = await flatApi.blockchain.profileSpaceIdByAccount(accountId)
  const profile = await flatApi.base.findSpace({ id: profileSpaceId.toString() })
  selectedAddress = address
  selectedProfile = profile
}

export const connectWallet = async () => {
  const { isWeb3Injected, web3Enable, web3AccountsSubscribe } = await import('@polkadot/extension-dapp')
  const extensions = await web3Enable('twitter')
  if (!isWeb3Injected) {
    // no extension installed
    alert('Browser have not extension')
    return;
  }

  if (extensions.length === 0) {
    // the user did not accept the authorization
    // in this case we should inform the use and give a link to the extension
    alert('Polkadot Extension not authorized us to get accounts');
    return;
  }

  await web3AccountsSubscribe(async (injectedAccounts) => {
    if (injectedAccounts.length > 0) {
      const addresses = injectedAccounts.map((account) => account.address)
      fetchProfile(addresses[0])
    }
  })

};

export const createSpace = async () => {
  const cid = await ipfs.saveContent({
    about: 'Subsocial is an open protocol for decentralized social networks and marketplaces. It`s built with Substrate and IPFS',
    name: 'SubSocial dApps',
    tags: ['djinni', 'task']
  })

  const substrateApi = await flatApi.blockchain.api

  const spaceTx = substrateApi.tx.spaces.createSpace(
    IpfsContent(cid),
    null // Permissions config (optional)
  )

  signAndSendTx(spaceTx)
}

export const postTweet = async (tweet: string) => {
  console.log('ipfs', ipfs)
  const cid = await ipfs.saveContent({
    title: selectedProfile && selectedProfile.content?.name ? selectedProfile.content?.name : selectedAddress,
    body: tweet,
    avatar: selectedProfile && selectedProfile.content?.image ? selectedProfile.content?.image : ''
  })
  console.log(cid)

  const substrateApi = await flatApi.blockchain.api
  const postTransaction = substrateApi.tx.posts.createPost(
    spaceId,
    { RegularPost: null }, // Creates a regular post.
    { IPFS: IpfsContent(cid) }
  )
  signAndSendTx(postTransaction)
}

export const findPost = async (id: any) => {
  flatApi.findPost({ id: '1' })
}