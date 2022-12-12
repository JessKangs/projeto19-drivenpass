import Cryptr from "cryptr"
import { networksRepository } from "../repositories/network-repository";
import { notFoundError } from "../errors"

const cryptr = new Cryptr('secretKey')

async function createNetwork(title: string, network: string, password: string, userId: number){
    const hashedPassword = cryptr.encrypt(password)

    const newNetwork = await networksRepository.createNetwork(title, network, hashedPassword, userId)

    return newNetwork;
}

async function getAllNetworks(userId:number) {
    const networks = await networksRepository.getAllNetworks(userId);

    if(networks.length === 0) throw notFoundError();

    return networks;
}

async function getNetworkById(networkId:number, userId: number){

    const network = await networksRepository.getNetworkById(networkId, userId)

    return network;
}

async function deleteNetwork(id:number) {

   const delection = await networksRepository.deleteNetworkById(id)

   return delection;
}

const networkServices = {
    createNetwork,
    getAllNetworks,
    getNetworkById,
    deleteNetwork
}

export { networkServices }